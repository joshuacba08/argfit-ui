import type { AfCommandContext, AfCommandJsonValue } from '../types/command-palette.types';

type TokenKind =
  | 'identifier'
  | 'string'
  | 'number'
  | 'boolean'
  | 'null'
  | 'operator'
  | 'punctuation'
  | 'eof';

interface Token {
  readonly kind: TokenKind;
  readonly value: string;
  readonly position: number;
}

const OPERATORS = ['===', '!==', '>=', '<=', '==', '!=', '&&', '||', '>', '<', '!'] as const;

export function evaluateAfCommandContextExpression(
  expression: string | undefined,
  context: AfCommandContext,
): boolean {
  if (!expression?.trim()) {
    return true;
  }
  return Boolean(new ExpressionParser(tokenize(expression), context).parse());
}

export function validateAfCommandContextExpression(expression: string): string | null {
  try {
    new ExpressionParser(tokenize(expression), {}).parse();
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : 'Expresión no válida';
  }
}

function tokenize(source: string): readonly Token[] {
  const tokens: Token[] = [];
  let index = 0;

  while (index < source.length) {
    const character = source[index]!;
    if (/\s/.test(character)) {
      index += 1;
      continue;
    }

    const operator = OPERATORS.find((candidate) => source.startsWith(candidate, index));
    if (operator) {
      tokens.push({ kind: 'operator', value: operator, position: index });
      index += operator.length;
      continue;
    }

    if ('(),[]'.includes(character)) {
      tokens.push({ kind: 'punctuation', value: character, position: index });
      index += 1;
      continue;
    }

    if (character === "'" || character === '"') {
      const quote = character;
      const start = index;
      let value = '';
      index += 1;
      while (index < source.length && source[index] !== quote) {
        if (source[index] === '\\' && index + 1 < source.length) {
          index += 1;
        }
        value += source[index]!;
        index += 1;
      }
      if (source[index] !== quote) {
        throw new Error(`Cadena sin cerrar en la posición ${start}`);
      }
      index += 1;
      tokens.push({ kind: 'string', value, position: start });
      continue;
    }

    const numberMatch = source.slice(index).match(/^-?\d+(?:\.\d+)?/);
    if (numberMatch) {
      tokens.push({ kind: 'number', value: numberMatch[0], position: index });
      index += numberMatch[0].length;
      continue;
    }

    const identifierMatch = source.slice(index).match(/^[A-Za-z_$][\w$.-]*/);
    if (identifierMatch) {
      const value = identifierMatch[0];
      const kind: TokenKind = value === 'true' || value === 'false'
        ? 'boolean'
        : value === 'null'
          ? 'null'
          : value === 'in' || value === 'not'
            ? 'operator'
            : 'identifier';
      tokens.push({ kind, value, position: index });
      index += value.length;
      continue;
    }

    throw new Error(`Token inesperado “${character}” en la posición ${index}`);
  }

  tokens.push({ kind: 'eof', value: '', position: source.length });
  return tokens;
}

class ExpressionParser {
  private index = 0;

  constructor(
    private readonly tokens: readonly Token[],
    private readonly context: AfCommandContext,
  ) {}

  parse(): unknown {
    const value = this.parseOr();
    if (this.current().kind !== 'eof') {
      throw new Error(`Token inesperado “${this.current().value}” en la posición ${this.current().position}`);
    }
    return value;
  }

  private parseOr(): unknown {
    let value = this.parseAnd();
    while (this.match('||')) {
      const right = this.parseAnd();
      value = Boolean(value) || Boolean(right);
    }
    return value;
  }

  private parseAnd(): unknown {
    let value = this.parseUnary();
    while (this.match('&&')) {
      const right = this.parseUnary();
      value = Boolean(value) && Boolean(right);
    }
    return value;
  }

  private parseUnary(): unknown {
    if (this.match('!') || this.match('not')) {
      return !Boolean(this.parseUnary());
    }
    return this.parseComparison();
  }

  private parseComparison(): unknown {
    const left = this.parsePrimary();
    const operator = this.current().value;
    const isNotIn = operator === 'not' && this.peek().value === 'in';
    if (isNotIn) {
      this.index += 2;
      return !this.includes(this.parsePrimary(), left);
    }
    if (!['===', '!==', '==', '!=', '>', '>=', '<', '<=', 'in'].includes(operator)) {
      return left;
    }
    this.index += 1;
    const right = this.parsePrimary();
    switch (operator) {
      case '===':
      case '==':
        return left === right;
      case '!==':
      case '!=':
        return left !== right;
      case '>':
        return this.comparable(left) > this.comparable(right);
      case '>=':
        return this.comparable(left) >= this.comparable(right);
      case '<':
        return this.comparable(left) < this.comparable(right);
      case '<=':
        return this.comparable(left) <= this.comparable(right);
      case 'in':
        return this.includes(right, left);
      default:
        return false;
    }
  }

  private parsePrimary(): unknown {
    const token = this.current();
    if (this.match('(')) {
      const value = this.parseOr();
      this.expect(')');
      return value;
    }
    if (this.match('[')) {
      const values: unknown[] = [];
      while (!this.match(']')) {
        values.push(this.parseOr());
        if (!this.match(',')) {
          this.expect(']');
          break;
        }
      }
      return values;
    }
    this.index += 1;
    switch (token.kind) {
      case 'string':
        return token.value;
      case 'number':
        return Number(token.value);
      case 'boolean':
        return token.value === 'true';
      case 'null':
        return null;
      case 'identifier':
        return this.resolvePath(token.value);
      default:
        throw new Error(`Se esperaba un valor en la posición ${token.position}`);
    }
  }

  private resolvePath(path: string): AfCommandJsonValue | undefined {
    let value: unknown = this.context;
    for (const segment of path.split('.')) {
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return undefined;
      }
      value = (value as Record<string, unknown>)[segment];
    }
    return value as AfCommandJsonValue | undefined;
  }

  private includes(container: unknown, value: unknown): boolean {
    if (Array.isArray(container)) {
      return container.some((candidate) => candidate === value);
    }
    if (typeof container === 'string' && typeof value === 'string') {
      return container.includes(value);
    }
    return false;
  }

  private comparable(value: unknown): string | number {
    return typeof value === 'number' ? value : String(value ?? '');
  }

  private current(): Token {
    return this.tokens[this.index]!;
  }

  private peek(): Token {
    return this.tokens[this.index + 1] ?? this.tokens.at(-1)!;
  }

  private match(value: string): boolean {
    if (this.current().value !== value) {
      return false;
    }
    this.index += 1;
    return true;
  }

  private expect(value: string): void {
    if (!this.match(value)) {
      throw new Error(`Se esperaba “${value}” en la posición ${this.current().position}`);
    }
  }
}
