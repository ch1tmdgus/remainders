import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { quotesPlugin } from './plugins/quotes-plugin';
import { habitTrackerPlugin } from './plugins/habit-tracker-plugin';
import { moonPhasePlugin } from './plugins/moon-phase-plugin';

// Helper to extract default settings from configSchema
function getDefaultSettings(configSchema: any): any {
  if (!configSchema) return {};
  const defaults: any = {};
  for (const [key, config] of Object.entries(configSchema)) {
    const configValue = config as any;
    if (configValue.default !== undefined) {
      defaults[key] = configValue.default;
    }
  }
  return defaults;
}

export async function seedExamplePlugins() {
  if (!db) {
    console.error('Firebase not initialized');
    return;
  }

  const plugins = [quotesPlugin, habitTrackerPlugin, moonPhasePlugin];

  try {
    for (const plugin of plugins) {
      const pluginData = {
        id: plugin.id,
        name: plugin.name,
        author: plugin.author,
        version: plugin.version,
        description: plugin.description,
        code: plugin.execute?.toString() || '',
        configSchema: plugin.configSchema,
        defaultSettings: getDefaultSettings(plugin.configSchema),
        approved: true,
        downloads: 0,
        rating: 5.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'plugins', plugin.id), pluginData);
      console.log(`Seeded plugin: ${plugin.name}`);
    }

    console.log('All example plugins seeded successfully!');
    return { success: true };
  } catch (error: any) {
    console.error('Error seeding plugins:', error);
    throw new Error(error?.message || 'Failed to seed plugins. Check Firestore security rules.');
  }
}
