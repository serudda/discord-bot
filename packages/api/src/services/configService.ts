import { prisma } from '@discord-bot/db';

class ConfigService {
  private globalConfigCache = new Map<string, string>();
  // Time to live of the cache in milliseconds (5 minutes)
  private cacheTTL = 300000;
  private lastCacheUpdate = 0;

  // Method to load global configurations
  private async loadGlobalConfigs(): Promise<void> {
    const now = Date.now();

    // Check if the cache is valid, if so, it's not necessary to reload
    if (now - this.lastCacheUpdate < this.cacheTTL && this.globalConfigCache.size > 0) return;

    // Load configurations from the database
    const configs = await prisma.config.findMany();
    // Clear the cache before reloading
    this.globalConfigCache.clear();
    configs.forEach((config) => {
      this.globalConfigCache.set(config.key, config.value);
    });

    // Update the last load time
    this.lastCacheUpdate = now;
  }

  // Method to get a global configuration
  public async getGlobalConfig<T>(key: string, defaultValue: T): Promise<T> {
    await this.loadGlobalConfigs(); // Asegurar que las configuraciones están cargadas
    const value = this.globalConfigCache.get(key);
    return value !== undefined ? (this.parseValue(value) as T) : defaultValue;
  }

  // Method to initialize the service
  public async initialize(): Promise<void> {
    await this.loadGlobalConfigs();
  }

  // Method to parse the value to the correct type
  private parseValue(value: string): string | number | boolean {
    // Try to convert to number
    if (!isNaN(Number(value))) return Number(value);

    // Try to convert to boolean
    if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
      return value.toLowerCase() === 'true';
    }

    return value;
  }
}

export const configService = new ConfigService();
