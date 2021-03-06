const { Pool } = require('pg');

const pool = new Pool ({
  user: 'vagrant',
  passowrd: '123',
  host : 'localhost',
  database: 'bootcampx'
});

pool.connect(() => {
  console.log("Connected to the Database");
});

const cohortName = process.argv[2];
const values = [`%${cohortName}%`];

pool.query(`
SELECT teachers.name AS teacher, cohorts.name AS cohort
FROM teachers
JOIN assistance_requests ON teachers.id = teacher_id
JOIN students ON students.id = student_id
JOIN cohorts ON cohorts.id = cohort_id
WHERE cohorts.name LIKE $1
GROUP BY teachers.name, cohorts.name;
`, values)
.then(res => {
  res.rows.forEach(user => {
    console.log(`${user.cohort}: ${user.teacher}`);
  })
})
.catch(err => console.error('query error', err.stack));
