import { fakeAsync, flush, flushMicrotasks } from "@angular/core/testing";

fdescribe("Async Testing Examples", () => {
  it("Asynchronous test example with Jasmine done()", (done: DoneFn) => {
    let test = false;

    setTimeout(() => {
      console.log("running asertions");
      test = true;
      expect(test).toBeTruthy();
      done();
    }, 1000);
  });

  it("Asynchronous test example - setTimeout()", fakeAsync(() => {
    let test = false;
    setTimeout(() => {});

    setTimeout(() => {
      console.log("running asertions setTimeout()");
      test = true;
    }, 1000);

    flush();
    expect(test).toBeTruthy();
  }));

  fit("Asynchronous test example - plain promise", fakeAsync(() => {
    let test = false;

    console.log("creating promise");

    Promise.resolve()
      .then(() => {
        console.log("Promise first then() evaluated successfully");

        return Promise.resolve();
      })
      .then(() => {
        console.log("Promise second then() evaluated successfully");
        test = true;
      });

    flushMicrotasks();

    console.log("running test assertions");
    expect(test).toBeTruthy();
  }));
});
