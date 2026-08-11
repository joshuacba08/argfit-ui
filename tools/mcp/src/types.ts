export type ComponentStatus = 'documented' | 'experimental' | 'legacy-undocumented';
export type Platform = 'desktop' | 'mobile';
export type Theme = 'dark' | 'light';

export interface ApiMember {
  readonly name: string;
  readonly type: string;
  readonly required: boolean;
  readonly defaultValue: string | null;
  readonly description: string;
  readonly deprecated: boolean;
}

export interface StoryReference {
  readonly id: string;
  readonly name: string;
  readonly url: string;
}

export interface ComponentExample {
  readonly story: string | null;
  readonly typescript: string;
  readonly template: string;
}

export interface CatalogComponent {
  readonly id: string;
  readonly name: string;
  readonly className: string;
  readonly selector: string;
  readonly package: string;
  readonly importStatement: string;
  readonly title: string;
  readonly category: string;
  readonly status: ComponentStatus;
  readonly description: string;
  readonly platforms: readonly Platform[];
  readonly useWhen: readonly string[];
  readonly avoidWhen: readonly string[];
  readonly related: readonly string[];
  readonly tokens: readonly string[];
  readonly api: {
    readonly inputs: readonly ApiMember[];
    readonly outputs: readonly ApiMember[];
  };
  readonly stories: readonly StoryReference[];
  readonly docsUrl: string | null;
  readonly example: ComponentExample | null;
}

export interface DesignToken {
  readonly name: string;
  readonly family: string;
  readonly values: Readonly<Record<Theme, string | null>>;
}

export interface CatalogGuide {
  readonly id: string;
  readonly title: string;
  readonly uri: string;
  readonly storybookUrl: string;
  readonly content: string;
}

export interface ArgfitCatalog {
  readonly schemaVersion: string;
  readonly library: {
    readonly name: string;
    readonly version: string;
    readonly gitSha: string;
    readonly generatedAt: string;
    readonly sourceDigest: string;
    readonly storybookBaseUrl: string;
  };
  readonly components: readonly CatalogComponent[];
  readonly tokens: readonly DesignToken[];
  readonly guides: readonly CatalogGuide[];
}

export interface VersionNotice {
  readonly requested: string;
  readonly available: string;
  readonly compatible: boolean;
  readonly message: string;
}

export interface SearchOptions {
  readonly query: string;
  readonly category?: string;
  readonly platform?: Platform;
  readonly status?: ComponentStatus;
  readonly includeLegacy?: boolean;
  readonly limit?: number;
}

export interface SearchResult {
  readonly component: CatalogComponent;
  readonly score: number;
  readonly matches: readonly string[];
}

export type DiagnosticSeverity = 'error' | 'warning' | 'info';

export interface UsageDiagnostic {
  readonly code: string;
  readonly severity: DiagnosticSeverity;
  readonly message: string;
  readonly line: number;
  readonly column: number;
  readonly suggestion?: string;
}
