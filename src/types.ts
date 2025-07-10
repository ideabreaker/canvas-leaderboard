/**
 * Defines the data structure for a single user on the leaderboard.
 * @example
 * const user = {
 * nickname: 'PlayerOne',
 * avatarUrl: 'https://example.com/avatar.png',
 * level: 15,
 * xp: 3500,
 * neededXp: 4000,
 * };
 */
export interface LeaderboardData {
    nickname: string;
    avatarUrl: string;
    level: number;
    xp: number;
    neededXp: number;
    rank?: string;
}

/**
 * Defines the colors for the top 3 podium positions.
 * @example
 * const podiumColors = {
 * first: '#FFD700',
 * second: '#C0C0C0',
 * third: '#CD7F32',
 * };
 */
export interface PodiumColors {
    first?: string;
    second?: string;
    third?: string;
}

/**
 * Specifies the available types of gradients for the background.
 */
export type GradientType = 
    | 'linear-left-right' 
    | 'linear-right-left' 
    | 'linear-top-bottom' 
    | 'linear-bottom-top' 
    | 'linear-top-left-bottom-right' 
    | 'linear-top-right-bottom-left'
    | 'radial';

/**
 * Defines the options for a gradient background.
 * @example
 * const gradient = {
 * type: 'linear-top-bottom',
 * colors: ['#ff0000', '#0000ff'],
 * };
 */
export interface GradientOptions {
    type: GradientType;
    colors: string[];
}

/**
 * Defines a single "spot" or "blur" for the aurora effect
 */
export interface AuroraSpot {
    color: string;
    x: number;
    y: number;
    radius: number;
}

/**
 * Defines the options for an "aurora" style background effect.
 * @example
 * const aurora = {
 *     type: 'aurora',
 *     baseColor: '#0D0E12',
 *     spots: [
 *         { color: '#5865f2', x: 0, y: 0, radius: 450 },
 *         { color: '#be4eea', x: 900, y: 800, radius: 500 },
 *     ],
 * };
 */
export interface AuroraBackgroundOptions {
    type: 'aurora';
    baseColor: string;
    spots: AuroraSpot[];
}

/**
 * Represents all possible background types: a solid color, a gradient, or an aurora effect.
 */
export type BackgroundOptions = string | GradientOptions | AuroraBackgroundOptions;

/**
 * Defines the options for the leaderboard header.
 * @example
 * const header = {
 *     title: 'Server Leaderboard',
 *     subtitle: 'Top 10 Players',
 * };
 */
export interface HeaderOptions {
    title: string;
    subtitle?: string;
}

/**
 * Defines the options for highlighting the podium positions.
 * @example
 * const podiumOptions = {
 *     colors: {
 *         first: '#FFD700',
 *         second: '#C0C0C0',
 *     }
 * };
 */
export interface PodiumOptions {
    colors?: PodiumColors;
}

/**
 * Defines a rank tier based on the minimum required experience points (XP).
 * @example
 * const rank = {
 *     name: 'Master',
 *     color: '#E0B0FF',
 *     minXp: 5000,
 * };
 */
export interface RankTier {
    name: string;
    color: string;
    minXp: number;
}

/**
 * Defines the primary and secondary colors for the XP progress bar.
 * @example
 * const xpColors = {
 *     primary: '#5865F2',
 *     secondary: '#A458F2',
 * };
 */
export interface XpBarColors {
    primary: string;
    secondary: string;
}

/**
 * Defines the font styles for various text elements on the leaderboard.
 * Each property accepts a CSS-like font string.
 * @example
 * const fontStyles = {
 *     headerTitle: 'bold 48px Arial',
 *     userNickname: '24px "Open Sans"',
 * };
 */
export interface FontStyles {
    headerTitle?: string;
    headerSubtitle?: string;
    userNickname?: string;
    userLevel?: string;
    userPosition?: string;
    xpText?: string;
    rankText?: string;
}