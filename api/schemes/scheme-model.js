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
  // EXERCISE D
  /*
    1D- This function creates a new scheme and resolves to _the newly created scheme_.
  */
  return db("schemes")
    .insert(scheme)
    .then((id) => {
      return db("schemes").where("scheme_id", id).first();
    });
}

async function addStep(scheme_id, step) {
  // EXERCISE E
  /*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
  */
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
};
