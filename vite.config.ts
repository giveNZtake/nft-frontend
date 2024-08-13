import react from "@vitejs/plugin-react";

export default function () {
  return {
    plugins: [react()],
    server: {
      host: "0.0.0.0",
      port: 80,
    },
  };
}
