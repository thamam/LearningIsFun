/**
 * Headless Math Engine - Main Export
 * Registry of all available math modules
 */

import { divisionModule } from './modules/division';
import { multiplicationModule } from './modules/multiplication';
import { fractionModule } from './modules/fraction';
import { distributiveModule } from './modules/distributive';
import { orderOperationsModule } from './modules/order-operations';
import { decimalModule } from './modules/decimal';
import { numberLineModule } from './modules/number-line';
import { MathModule } from './types';

export * from './types';
export {
  divisionModule,
  multiplicationModule,
  fractionModule,
  distributiveModule,
  orderOperationsModule,
  decimalModule,
  numberLineModule,
};

// Module registry
export const modules: Record<string, MathModule> = {
  division: divisionModule,
  multiplication: multiplicationModule,
  fraction: fractionModule,
  distributive: distributiveModule,
  'order-operations': orderOperationsModule,
  decimal: decimalModule,
  'number-line': numberLineModule,
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
