import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";
import { TestBed, TestModuleMetadata } from '@angular/core/testing';

//xdescribe (starting with x disable the test)
//f.... (starting with f disalbe other tests instead it - focus)
describe('calculator-service', () => {

    let calculatorService: CalculatorService,
        loggerSpy: any;

    beforeEach(() => {
        // ---- unit test without CDI
        // 1st param is Class
        // 2nd param is an array of functions that will be mocked
        // loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);

        // In case function needs to return a value:
        // logger.log.and.returnValue(resp);
        //
        // calculatorService = new CalculatorService(loggerSpy);
        // ---- end of unit test without CDI

        // ---- unit test with CDI
        loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);

        const testConfig: TestModuleMetadata = {
            providers: [
                CalculatorService,
                { provide: LoggerService, useValue: loggerSpy }
            ]
        };
        TestBed.configureTestingModule(testConfig);

        calculatorService = TestBed.inject(CalculatorService);
        // ---- end of unit test with CDI
    });

    it('should add 2 numbers', () => {    
        const result = calculatorService.add(2, 2);

        expect(result).toBe(4, 'unexpected add result');
        expect(loggerSpy.log).toHaveBeenCalledTimes(1);
    });

    it('should subtract 2 numbers', () => {        
        const result = calculatorService.subtract(2, 2);

        expect(result).toBe(0, 'unexpected subtraction result');
        expect(loggerSpy.log).toHaveBeenCalledTimes(1);
    });
});