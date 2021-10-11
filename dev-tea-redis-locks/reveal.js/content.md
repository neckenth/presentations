### Redis Locks

Documentation: https://github.com/andymccurdy/redis-py/blob/master/redis/lock.py

---

#### Distributed Locking

- A singular, shared, synchronously-accessible resource to be used as locking mechanism between multiple threads/processes/machines.
- Prevent data corruption or race conditions between processes sharing the same source data.
- In our case, the processes sharing the locks are Celery tasks/workers.
  - We wanted to prevent multiple tasks responsible for re-evaluating audiences and refreshing the Redis cache from running at the same time.
  - We use Redis to store these ephemeral locks and act as the source of truth for processes in-progress.

---

#### Core principles

- Mutual exclusion: at any time, only one client can hold a lock w/ a given key.
- No deadlocks: eventually, it should always be possible to acquire a lock, even if the client crashes.

---

#### Mental Model (inspired by Evan)

![image info](./images/temp_lockers.png)

---

- Acquiring the lock = using the open locker and taking the key.
- Skating time limit = lock "time-to-live" (TTL)
- Locker waiting time limit = lock acquisition `blocking_timeout`
- Extending the lock = asking the rental guy nicely.
- Releasing the lock = putting your sneakers on and leaving the key in the locker - OR - the rental guy puts your stuff in the lost-n-found and makes a new key for that locker (timing out).

#### Demo

1. Define a unique key and TTL for your lock
2. Acquire a lock w/ that key and a `blocking_timeout` (only wait for x seconds)
3. Perform operations
4. Release the lock

---

#### One Wrinkle: Lock Tokens

- Used to prevent race conditions betwn clients:
  - Client 1 acquires a lock and times out during processing
  - Before Client 1 has released the lock, Client 2 acquires it and begins processing.
  - Client 1 releases the lock, which releases it from Client 2.
  - Now, the lock is available to other clients while Client 2 is working.

---

#### Lock Tokens cont'd

- Lock is being acquired in 1 function and released in another.
- Our workaround: assign static lock tokens that all functions/processes/workers can use for each lock. (an expectable key name and token for each lock)
- Demo

#### Our Implementation: Attempt # 1

- Passing locks with long TTLs back and forth between the every-5-minute task and the midnight full refresh.
- Tons of errors where we were attempting to release a lock that was not owned, or we were unable to acquire a lock in time
- Debugging was super challenging...

---

#### Our Implementation: Attempt # 2 (current)

- Each time a filter needs to be re-evaluated in order to refresh the Redis cache regardless of whichever process kicked it off...

  - Attempt to acquire a lock for that filter
  - If unable to acquire, stop.
  - If able to acquire, re-evaluate.
  - Update the cache, and release the lock.

#### Our Implementation: Attempt # 2 Cont'd

- However we're refreshing the cache for the filter (based on contact changes or full audience refresh), let the current re-eval/update finish before trying again.

- Benefits:
  - Lock needs to live for a much shorter duration
    - Less collisions if multiple evaluations are being kicked off in short time spans.
  - Same behavior for both recurring and ad-hoc refreshes.
    - Much cleaner and easier to debug.
