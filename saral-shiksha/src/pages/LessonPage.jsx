// src/pages/LessonPage.jsx
import { useParams } from "react-router-dom";
import PlaceholderPage from "../components/PlaceholderPage";

export default function LessonPage() {
  const { id } = useParams();
  return (
    <PlaceholderPage
      title={`Lesson: ${id}`}
      route={`/lesson/${id}`}
      subtitle="Accessible lesson viewer with text, video, captions, and read-aloud support."
    />
  );
}
