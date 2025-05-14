import { vi } from "vitest";

export const useParams = () => ({
  id: "123",
});

export const useNavigate = () => vi.fn();

export const Link = ({ children }) => children;
