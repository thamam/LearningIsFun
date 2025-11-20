/**
 * Extracted Math Modules - Barrel File
 *
 * Single entry point for all headless math modules.
 * Import with: const { DivisionModule, NumberLineModule } = require('./extracted-modules');
 *
 * All modules are zero-dependency, headless classes that return JSON View Objects.
 * Ready for Next.js API routes or server-side rendering.
 *
 * @version 1.0.0
 * @phase 2-complete
 */

// Import all modules
const DivisionModule = require('./modules/DivisionModule');
const DecimalModule = require('./modules/DecimalModule');
const FractionModule = require('./modules/FractionModule');
const MultiplicationModule = require('./modules/MultiplicationModule');
const OrderOperationsModule = require('./modules/OrderOperationsModule');
const DistributiveModule = require('./modules/DistributiveModule');
const NumberLineModule = require('./modules/NumberLineModule');

// Export all modules
module.exports = {
    DivisionModule,
    DecimalModule,
    FractionModule,
    MultiplicationModule,
    OrderOperationsModule,
    DistributiveModule,
    NumberLineModule
};

// ES6 named exports for Next.js compatibility
if (typeof exports !== 'undefined') {
    exports.DivisionModule = DivisionModule;
    exports.DecimalModule = DecimalModule;
    exports.FractionModule = FractionModule;
    exports.MultiplicationModule = MultiplicationModule;
    exports.OrderOperationsModule = OrderOperationsModule;
    exports.DistributiveModule = DistributiveModule;
    exports.NumberLineModule = NumberLineModule;
}
