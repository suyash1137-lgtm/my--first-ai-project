// src/pages/QuizPage.jsx
import { useParams } from "react-router-dom";
import PlaceholderPage from "../components/PlaceholderPage";

export default function QuizPage() {
  const { id } = useParams();
  return (
    <PlaceholderPage
      title={`Quiz: ${id}`}
      route={`/quiz/${id}`}
      subtitle="Accessible quiz interface with read-aloud questions and simplified language support."
    />
  );
}
