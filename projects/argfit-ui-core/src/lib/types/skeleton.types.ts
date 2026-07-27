/**
 * Shape of a loading placeholder.
 *
 * `text` renders stacked lines with a shorter last one, which is what reads as prose;
 * `rect` and `circle` stand in for media and avatars.
 */
export type AfSkeletonShape = 'text' | 'rect' | 'circle';

export type AfSkeletonAnimation = 'pulse' | 'none';
