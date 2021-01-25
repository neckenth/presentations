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

#### Spies

- **Watch** functions being called w/out changing their behavior
- Provides information about func calls:
  - Return values
    - Args
    - number of times called
    - `this` context
    - Exceptions thrown

---

#### Stubs

- **Replace** functions
  - Test the ways the deps of your code can be expected to act and the side effects
  - Trigger different code paths (e.g. error-handling)
  - Stub out async funcs - force them to run callbacks immediately

---

#### Mocks

- **Combination** betwn spies and stubs
  - Set expectations for the way a function will be called
  - Observes the way a function was called
  - Verify after function completes that all expectations are met

---

#### Also - Fakes

- A fake is a Function that records args, return value, `this context`, and exception thrown (if any) for all of its calls
- Immutable - once it's created, its behavior cannot be changed
