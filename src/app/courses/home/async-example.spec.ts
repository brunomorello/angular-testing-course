import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

describe('Async testing examples', () => {

    it('Asynchornous test example with jasmine done()', (done: DoneFn) => {
        let test = false;

        setTimeout(() => {
            console.log('running assertions');
            test = true;
            expect(test).toBeTruthy();
            done();
        }, 1000);
    });

    it('Asynchronous test example with fakeAsync', fakeAsync(() => {
        let test = false;

        setTimeout(() => {
            console.log('running assertions with fakeAsync');
            test = true;
        }, 1000);

        // tick() - Passes the time to match setTimeout 
        // tick(1000);

        // flush() - all async operations are completed before the test is marked as completed
        flush();
        expect(test).toBeTruthy();
    }));

    it('Asynchronous test example - plain Promise (Microtasks', fakeAsync(() => {
        let test = false;
        console.log(`Creating Promise`);

        // setTimeout(() => console.log(`1st callback triggered`));
        // setTimeout(() => console.log(`2nd callback triggered`));

        Promise.resolve().then(() => {
            console.log(`Promise first then() evaluated successfully`);
            return Promise.resolve();
        })
        .then(() => {
            console.log(`Promise second then() evaluated successfully`);
            test = true;
        });
        
        flush();

        console.log(`running assertions`);
        expect(test).toBeTruthy();
    }));

    it('Asynchronous test example - Promises + setTimeout()', fakeAsync(() => {
        let counter = 0;

        Promise.resolve()
        .then(() => {
            counter += 10;
            setTimeout(() => counter += 1, 1000);
        });

        expect(counter).toBe(0);
        
        flushMicrotasks();

        expect(counter).toBe(10);

        tick(500);

        expect(counter).toBe(10);
        
        tick(500);

        expect(counter).toBe(11);
    }));

    it('Asynchronous test example - Observables', fakeAsync(() => {
        let test = false;
        console.log(`Creating Observable`);

        const test$ = of(test).pipe(delay(1000));

        test$.subscribe(() => test = true);

        tick(1000);

        console.log(`Running assertions`);

        expect(test).toBe(true);
    }));
});