### Sinon.js

Documentation: https://sinonjs.org/

---

#### What is Sinon?

- "Test doubles": Spies, Stubs, Mocks
  - Async code
  - Code w/ external deps (db/network calls)
  - Side effects
- Testing-framework-agnostic

---

#### Stubs

- **Replace** functions
  - Test the ways the deps of your code can be expected to act and the side effects
  - Trigger different code paths (e.g. error-handling)
  - Stub out async funcs - force them to run callbacks immediately
  - Avoid dependency-injection

---

#### Spies

- **Watch** functions being called w/out changing their behavior
- Provides information about func calls:
  - Return values
    - Args
    - number of times called
    - `this` context
    - Exceptions thrown

---

- Two types of spies
  - Anonymous function spies
    - `sinon.spy()`
    - E.g. test how a method handles a callback.
  - Spies that wrap any/all object methods.

---

#### Mocks

- **Combination** betwn spies and stubs
  - Creates a fake wrapper (like a spy) around the method with pre-programmed behavior (like a stub).
  - Set expectations for the way a function will be called
  - Observes the way a function was called
  - Verify after function completes that all expectations are met

---

#### Also - Fakes

- A fake is an immutable Function that records args, return value, `this` context, and exception thrown (if any) for all of its calls
- Not used to replace behavior under test
  - Fake function w/ fake behavior you can then use to replace object methods in your test cases: `sinon.replace()`
