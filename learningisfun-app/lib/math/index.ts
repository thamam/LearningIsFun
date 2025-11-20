/**
 * Headless Math Engine - Main Export
 * Registry of all available math modules
 */

import { divisionModule } from './modules/division';
import { multiplicationModule } from './modules/multiplication';
import { MathModule } from './types';

export * from './types';
export { divisionModule, multiplicationModule };

// Module registry
export const modules: Record<string, MathModule> = {
  division: divisionModule,
  multiplication: multiplicationModule,
};

export function getModule(moduleName: string): MathModule | null {
  return modules[moduleName] || null;
}

export function getAllModules(): MathModule[] {
  return Object.values(modules);
}

export function getModuleNames(): string[] {
  return Object.keys(modules);
}
