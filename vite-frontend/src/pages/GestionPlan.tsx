import Layout from "../components/Layout";
import PlanForm from "../components/Formularios/PlanForm"

function GestionPlan() {
  return (
    <Layout>
      <h2 style={{ textAlign: "center" }}>📋 Planes académicos</h2>
      <PlanForm />
    </Layout>
  );
}

export default GestionPlan;