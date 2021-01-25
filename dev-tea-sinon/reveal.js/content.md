### Sinon.js

Documentation: https://sinonjs.org/

---

#### What is Sinon?

- "test doubles": spies, stubs, mocks
  - test async code, code w/ external deps (db/network calls), side effects
- testing-framework-agnostic - we test w/ Sinon in Neolith (Mocha test framework and Chai assertion library)

---

#### SELECT: Choose the data you want

```sql
-- SELECT all data from public api call table
SELECT *
  FROM legacy_publicapicalleventpg;


-- SELECT institution, endpoint, and HTTP method from
--- puplic api call table
SELECT college_id, endpoint, action
  FROM legacy_publicapicalleventpg;


-- SELECT all distinct institutions that have called
--- the public api
SELECT DISTINCT college_id
  FROM legacy_publicapicalleventpg;

```

---

#### WHERE: Filter your subset

```sql
-- equality/inequality
SELECT *
  FROM legacy_publicapicalleventpg
  WHERE college_id = 'oceanCounty';

SELECT *
  FROM legacy_publicapicalleventpg
  WHERE college_id <> 'admithubUniversity';


-- SELECT all API call data for `create` and
---- `update` HTTP methods
---- take note of wildcard (%)
---- % = 0+ characters
---- _ = exactly 1 character: _r% <-- where r is
---- in the 2nd position and followed by any or no characters
SELECT *
  FROM legacy_publicapicalleventpg
  WHERE action LIKE '%ate';


-- IN / NOT IN
-- SELECT all public API calls from georgia
SELECT *
  FROM legacy_publicapicalleventpg
  WHERE college_id IN (
    'gxhRWDJLtyYhpbu3P',
    'georgiaRetention'
    );

-- SELECT all public API calls excluding those from
--- internal institutions
SELECT *
  FROM legacy_publicapicalleventpg
  WHERE college_id NOT IN (
    'admithubUniversity',
    'admithubSiteDemo',
    'productTest'
    );


-- SELECT all public API call events that were created after 2/1
---- take note of type casting of dates
SELECT *
  FROM legacy_publicapicalleventpg
  WHERE CAST(created AS Date) > '2020-02-01';


-- SELECT only counselors with no reasons
SELECT *
  FROM legacy_counselorpg
  WHERE reason IS NULL;

-- SELECT only counselors with reasons
SELECT *
  FROM legacy_counselorpg
  WHERE reason IS NOT NULL;

```

---

#### GROUP BY: Group/Aggregate your subset

```sql
-- SELECT number of public API calls per institution
SELECT college_id, COUNT(*)
  FROM legacy_publicapicalleventpg
  GROUP BY college_id;


-- SELECT the number of unique API calls per institution,
--- endpoint, and HTTP method
SELECT college_id, endpoint, action, COUNT(*)
  FROM legacy_publicapicalleventpg
  GROUP BY college_id, endpoint, action;
```

---

#### HAVING: Filter your aggregate data

```sql
-- SELECT number of counselors per institution only
---- for institutions that have >10 counselors
---- HAVING allows you to further filter your agg data
---- you can still filter your pre-aggregated subset
---- using WHERE
SELECT college_id, COUNT(*)
  FROM legacy_counselorpg
  GROUP BY college_id
  HAVING COUNT(*) > 10;
```

---

#### ORDER BY

```sql
-- Select all successful data integration run attempts in order
---- from oldest to newest
---- take note that by default, order is ascending (ASC)
SELECT * FROM dataparty_dataintegrationrunattempt
  WHERE status = 'success'
  ORDER BY created;
```

---

#### LIMIT/OFFSET

```sql
-- Find the most recent failed data integration run attempt
SELECT * FROM dataparty_dataintegrationrunattempt
  WHERE status <> 'success'
  ORDER BY created DESC LIMIT(1);
```

---

#### JOINS

```sql
-- SELECT all api call data as well as token information for each call
---- take note of dot notation in column names, `.*`, and table aliases
SELECT API_CALL.*, TOKEN.created, TOKEN.created_by_id
  FROM legacy_publicapicalleventpg AS API_CALL
  JOIN legacy_authtokenpg AS TOKEN
  ON API_CALL.token_id = TOKEN.id;
```

---

### MORE ADVANCED: 3 WAYS TO DO THE SAME THING

---

#### SUBQUERIES

```sql
--- Find the highest priority escalation rule per institution
SELECT
	*
FROM
	legacy_escalationrulepg
WHERE
	TYPE = 'MANUAL'
	and(college_id, priority)
	IN(
		SELECT
			college_id, MAX(priority)
			FROM legacy_escalationrulepg
		GROUP BY
			college_id);
```

---

#### SELF JOINS

```sql
-- find the highest priority manual escalation rule per institution (again)
---- https://stackoverflow.com/questions/7745609/sql-select-only-rows-with-max-value-on-a-column
SELECT
	t1.id,
	t1.college_id,
	t1.counselor_id,
	t1.name,
	t1.priority
FROM
	legacy_escalationrulepg AS t1
	LEFT JOIN legacy_escalationrulepg AS t2
	ON (t1.college_id = t2.college_id
		AND t1.priority < t2.priority)
WHERE
	t2.priority IS NULL
	AND t1.type = 'MANUAL';


-- and again - this time with inner join
SELECT
	t1.id,
	t1.college_id,
	t1.counselor_id,
	t1.name,
	t1.priority
FROM
	legacy_escalationrulepg AS t1
	INNER JOIN (
		SELECT
			college_id,
			MAX(priority) as max
		FROM
			legacy_escalationrulepg
		WHERE
			type = 'MANUAL'
		GROUP BY
			college_id) AS t2
		ON t1.college_id = t2.college_id
		AND t1.priority = t2.max;
```

---

### More relevant examples

---

#### Find top 10 understandings by the number of fuzzy questions

- count, join, group by, order by

```sql
SELECT COUNT(q.*), qg.understanding_id
  FROM legacy_questionpg AS q
  JOIN legacy_questiongrouppg AS qg
  ON q.question_group_id = qg.id
GROUP BY qg.understanding_id
ORDER BY COUNT DESC
LIMIT(10);
```

---

#### Find the count of answers by institution

- count, join, group by

```sql
SELECT COUNT(a.*), ag.institution_id
  FROM legacy_answerpg AS a
  JOIN legacy_answergrouppg AS ag
  ON a.answer_group_id = ag.id
GROUP BY ag.institution_id;
```

---

#### Find the number of understandings updated each day for the past month

```sql
-- create a temp table to store days of month
-- http://tech.patientslikeme.com/2011/03/22/how-to-count.html
SELECT
	day INTO TEMP TABLE days
FROM (
	SELECT
		date::date AS day
	FROM
		generate_series('2020-01-01'::date, '2020-02-01'::date, '1 day') AS date) AS d;

-- then count per day
SELECT
	count(u.*),
	d.day
FROM
	legacy_understandingpg AS u
	JOIN days AS d ON cast(u.modified AS date) = d.day
GROUP BY
	d.day

-- OR ...
SELECT
	count(u.*),
	d.day
FROM
	legacy_understandingpg AS u
	RIGHT JOIN (
		SELECT
			date::date AS day
		FROM
			generate_series('2020-01-01'::date, '2020-02-01'::date, '1 day') AS date)
      AS d ON date_trunc('day', u.modified) = d.day
GROUP BY
	d.day;
```
