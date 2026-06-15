import { createFileRoute } from "@tanstack/react-router";
import Hero3DHub from "@/components/Hero3DHub";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "3D HUB — Think It. Design It. Print It." },
      {
        name: "description",
        content:
          "3D HUB is an immersive creative studio for 3D design, prototyping and printing. Think it, design it, print it.",
      },
      { property: "og:title", content: "3D HUB — Think It. Design It. Print It." },
      {
        property: "og:description",
        content:
          "An award-winning immersive 3D experience. Premium product storytelling for the next generation of makers.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <Hero3DHub />
    </main>
  );
}
