const db = require("../../data/db-config");

async function find() {
  const rows = await db("schemes as sc")
    .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
    .select("sc.scheme_id", "sc.scheme_name")
    .count("st.step_id as number_of_steps")
    .groupBy("sc.scheme_id")
    .orderBy("sc.scheme_id", "asc");
  return rows;
}

async function findById(scheme_id) {
  const rows = await db("schemes as sc")
    .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
    .select(
      "sc.scheme_name",
      "st.step_id",
      "st.step_number",
      "st.instructions",
      "sc.scheme_id"
    )
    .where("sc.scheme_id", scheme_id)
    .orderBy("st.step_number", "asc");

  let results = { steps: [] };
  for (let step of rows) {
    if (!results.scheme_id) {
      results.scheme_id = step.scheme_id;
      results.scheme_name = step.scheme_name;
    }
    if (step.step_id) {
      results.steps.push({
        step_id: step.step_id,
        step_number: step.step_number,
        instructions: step.instructions,
      });
    }
  }
  return results;
}

async function findSteps(scheme_id) {
  const rows = await db("steps as st")
    .leftJoin("schemes as sc", "st.scheme_id", "sc.scheme_id")
    .select("st.step_id", "st.step_number", "st.instructions", "sc.scheme_name")
    .where("st.scheme_id", scheme_id)
    .orderBy("st.step_number", "asc");

  return rows;
}

function add(scheme) {
  return db("schemes")
    .insert(scheme)
    .then(([scheme_id]) => {
      return db("schemes").where("scheme_id", scheme_id).first();
    });
}

async function addStep(scheme_id, step) {
  return db("steps")
    .insert({ ...step, scheme_id })
    .then(() => {
      return db("steps as st")
        .join("schemes as sc", "sc.scheme_id", "st.scheme_id")
        .select("step_id", "step_number", "instructions", "scheme_name")
        .orderBy("step_number")
        .where("sc.scheme_id", scheme_id);
    });
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
};
