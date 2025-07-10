import { createCanvas, loadImage, registerFont, CanvasRenderingContext2D } from 'canvas';
import { 
    LeaderboardData, 
    BackgroundOptions, 
    HeaderOptions, 
    PodiumOptions, 
    RankTier,
    XpBarColors,
    GradientOptions,
    AuroraSpot,
    AuroraBackgroundOptions,
    FontStyles
} from './types';

interface FontOptions {
    family: string;
    weight?: string;
    style?: string;
}

/**
 * A class to build a leaderboard image using a fluent API.
 */
export class LeaderboardBuilder {
    private users: LeaderboardData[] = [];
    private limit: number | null = null;
    private background: BackgroundOptions = '#0D0E12';
    private header: HeaderOptions = { title: 'Leaderboard' };
    private podium: PodiumOptions = {};
    private rankVisible: boolean = true;
    private rankTiers: RankTier[] = [];
    private xpBarColors: XpBarColors = { primary: '#5865F2', secondary: '#A458F2' };
    private fontStyles: FontStyles = {};

    constructor() {}

    /**
     * Registers a custom font from a file path.
     * @param path - The path to the font file.
     * @param options - The font options, including family, weight, and style.
     * @returns The builder instance for chaining.
     * @example
     * .addFont('./fonts/Roboto-Bold.ttf', { family: 'Roboto', weight: 'bold' })
     */
    public addFont(path: string, options: FontOptions): this {
        try {
            registerFont(path, options);
        } catch (error) {
            console.error(`Error registering font: ${options.family}`, error);
        }
        return this;
    }

    /**
     * Sets the user data for the leaderboard. Users should be pre-sorted by rank.
     * @param users - An array of user data objects.
     * @returns The builder instance for chaining.
     * @example
     * .setUsers([
     * { nickname: 'Player1', avatarUrl: '...', level: 10, xp: 5000, neededXp: 6000 },
     * { nickname: 'Player2', avatarUrl: '...', level: 9, xp: 4500, neededXp: 5000 }
     * ])
     */
    public setUsers(users: LeaderboardData[]): this {
        this.users = users;
        return this;
    }

    /**
     * Sets the header title and an optional subtitle.
     * @param options - The header options.
     * @returns The builder instance for chaining.
     * @example
     * .setHeader({ title: 'Global Leaderboard', subtitle: 'Top Players' })
     */
    public setHeader(options: HeaderOptions): this {
        this.header = options;
        return this;
    }

    /**
     * Configures special styling for the top 3 podium positions.
     * @param options - The podium styling options.
     * @returns The builder instance for chaining.
     * @example
     * .setPodium({ colors: { first: '#FFD700', second: '#C0C0C0', third: '#CD7F32' } })
     */
    public setPodium(options: PodiumOptions): this {
        this.podium = options;
        return this;
    }

    /**
     * Toggles the visibility of the rank column.
     * @param visible - Whether the rank column should be displayed. Defaults to true.
     * @returns The builder instance for chaining.
     * @example
     * .showRank(false) // Hides the rank column
     */
    public showRank(visible: boolean): this {
        this.rankVisible = visible;
        return this;
    }

    /**
     * Defines the rank tiers based on minimum XP. The library will automatically assign ranks.
     * @param tiers - An array of rank tier objects.
     * @returns The builder instance for chaining.
     * @example
     * .setRankTiers([
     *     { name: 'Master', color: '#E0B0FF', minXp: 5000 },
     *     { name: 'Beginner', color: '#FFFFFF', minXp: 0 }
     * ])
     */
    public setRankTiers(tiers: RankTier[]): this {
        this.rankTiers = tiers.sort((a, b) => b.minXp - a.minXp);
        return this;
    }

    /**
     * Sets the gradient colors for the XP progress bar.
     * @param colors - An object with primary and secondary color strings.
     * @returns The builder instance for chaining.
     * @example
     * .setXpBarColors({ primary: '#00ff00', secondary: '#00aa00' })
     */
    public setXpBarColors(colors: XpBarColors): this {
        this.xpBarColors = colors;
        return this;
    }

    /**
     * Overrides default font styles for various text elements.
     * @param styles - An object mapping text elements to CSS-like font strings.
     * @returns The builder instance for chaining.
     * @example
     * .setFontStyles({ headerTitle: 'bold 48px Arial', userNickname: '24px "Open Sans"' })
     */
    public setFontStyles(styles: FontStyles): this {
        this.fontStyles = { ...this.fontStyles, ...styles };
        return this;
    }

    /**
     * Sets the maximum number of users to display on the leaderboard.
     * @param count - The maximum number of users.
     * @returns The builder instance for chaining.
     * @example
     * .setLimit(10) // Shows only the top 10 users
     */
    public setLimit(count: number): this {
        this.limit = count;
        return this;
    }

    /**
     * Sets the background of the leaderboard.
     * @param options - A color string, a gradient object, or an aurora effect object.
     * @returns The builder instance for chaining.
     * @example
     * // Solid color
     * .setBackground('#2C2F33')
     * // Gradient
     * .setBackground({ type: 'radial', colors: ['#5865F2', '#0D0E12'] })
     * // Aurora effect
     * .setBackground({ type: 'aurora', baseColor: '#0D0E12', spots: [ { color: '#5865f2', x: 0, y: 0, radius: 500 }, { color: '#be4eea', x: 900, y: 800, radius: 600 } ] })
     */
    public setBackground(options: BackgroundOptions): this {
        this.background = options;
        return this;
    }

    private roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    private getRankForXp(xp: number): RankTier | null {
        if (this.rankTiers.length === 0) return null;
        return this.rankTiers.find(tier => xp >= tier.minXp) || null;
    }

    /**
     * Builds the leaderboard image and returns it as a Buffer.
     * This is the final method that should be called in the chain.
     * @returns A Promise that resolves with the PNG image buffer.
     * @example
     * const imageBuffer = await new LeaderboardBuilder()
     * // ... all your configurations
     * .build();
     */
    public async build(): Promise<Buffer> {
        const usersToRender = this.limit ? this.users.slice(0, this.limit) : this.users;
        const width = 900;
        const headerHeight = this.header.subtitle ? 150 : 120;
        const height = headerHeight + (usersToRender.length * 100) + 20;
        
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        if (typeof this.background === 'string') {
            ctx.fillStyle = this.background;
            ctx.fillRect(0, 0, width, height);
        } else if (this.background.type === 'aurora') {
            const auroraOptions = this.background as AuroraBackgroundOptions;
            
            ctx.fillStyle = auroraOptions.baseColor;
            ctx.fillRect(0, 0, width, height);

            ctx.globalAlpha = 0.4;

            for (const spot of auroraOptions.spots) {
                const gradient = ctx.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, spot.radius);

                gradient.addColorStop(0, spot.color);
                gradient.addColorStop(1, `${spot.color}00`);

                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
            }

            ctx.globalAlpha = 1;
        } else {
            const gradientOptions = this.background as GradientOptions;
            let gradient;
            switch (gradientOptions.type) {
                case 'linear-left-right': gradient = ctx.createLinearGradient(0, 0, width, 0); break;
                case 'linear-right-left': gradient = ctx.createLinearGradient(width, 0, 0, 0); break;
                case 'linear-top-bottom': gradient = ctx.createLinearGradient(0, 0, 0, height); break;
                case 'linear-bottom-top': gradient = ctx.createLinearGradient(0, height, 0, 0); break;
                case 'linear-top-left-bottom-right': gradient = ctx.createLinearGradient(0, 0, width, height); break;
                case 'linear-top-right-bottom-left': gradient = ctx.createLinearGradient(width, 0, 0, height); break;
                case 'radial': gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 2); break;
                default: gradient = ctx.createLinearGradient(0, 0, width, height);
            }
            gradientOptions.colors.forEach((color, index) => {
                gradient.addColorStop(index / (gradientOptions.colors.length - 1), color);
            });
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        }

        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = this.fontStyles.headerTitle || 'bold 42px Roboto';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.fillText(this.header.title, width / 2, 85);
        if(this.header.subtitle) {
            ctx.font = this.fontStyles.headerSubtitle || '22px Roboto';
            ctx.fillStyle = '#B9BBBE';
            ctx.fillText(this.header.subtitle, width / 2, 115);
        }
        ctx.shadowColor = 'transparent';

        for (let i = 0; i < usersToRender.length; i++) {
            const player = usersToRender[i];
            const position = i + 1;
            const y = headerHeight + i * 100;

            ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
            this.roundRect(ctx, 30, y, width - 60, 90, 15);
            ctx.fill();

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1;
            this.roundRect(ctx, 30, y, width - 60, 90, 15);
            ctx.stroke();

            const podiumColor = 
                (position === 1 && this.podium.colors?.first) ||
                (position === 2 && this.podium.colors?.second) ||
                (position === 3 && this.podium.colors?.third);

            if (podiumColor) {
                ctx.strokeStyle = podiumColor;
                ctx.lineWidth = 2;
                this.roundRect(ctx, 30, y, width - 60, 90, 15);
                ctx.stroke();
            }

            ctx.font = this.fontStyles.userPosition || 'bold 30px Roboto';
            ctx.fillStyle = '#B9BBBE';
            ctx.textAlign = 'center';
            ctx.fillText(position.toString(), 80, y + 58);

            try {
                const avatar = await loadImage(player.avatarUrl);
                ctx.save();
                ctx.beginPath();
                ctx.arc(170, y + 45, 30, 0, Math.PI * 2);
                ctx.clip();
                ctx.drawImage(avatar, 140, y + 15, 60, 60);
                ctx.restore();
            } catch(e) { console.error('Could not load avatar', e); }

            ctx.textAlign = 'left';
            ctx.fillStyle = '#FFFFFF';
            ctx.font = this.fontStyles.userNickname || 'bold 22px Roboto';
            ctx.fillText(player.nickname, 225, y + 40);
            ctx.fillStyle = '#B9BBBE';
            ctx.font = this.fontStyles.userLevel || '16px Roboto';
            ctx.fillText(`Level ${player.level}`, 225, y + 65);

            const barStartX = 450;
            const barWidth = this.rankVisible ? 200 : 350;
            const barHeight = 10;
            const progress = player.neededXp > 0 ? player.xp / player.neededXp : 0;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this.roundRect(ctx, barStartX, y + 45, barWidth, barHeight, 5);
            ctx.fill();
            if (progress > 0) {
                const xpGradient = ctx.createLinearGradient(barStartX, 0, barStartX + barWidth, 0);
                xpGradient.addColorStop(0, this.xpBarColors.primary);
                xpGradient.addColorStop(1, this.xpBarColors.secondary);
                ctx.fillStyle = xpGradient;
                this.roundRect(ctx, barStartX, y + 45, barWidth * Math.min(progress, 1), barHeight, 5);
                ctx.fill();
            }
            ctx.font = this.fontStyles.xpText || 'bold 10px Roboto';
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'right';
            ctx.fillText(`${player.xp} / ${player.neededXp}`, barStartX + barWidth, y + 70);

            const rank = this.getRankForXp(player.xp);
            if (this.rankVisible && rank) {
                ctx.textAlign = 'right';
                ctx.font = this.fontStyles.rankText || 'bold 22px Roboto';
                ctx.fillStyle = rank.color;
                ctx.fillText(rank.name, width - 50, y + 58);
            }
        }

        return canvas.toBuffer('image/png');
    }
}
