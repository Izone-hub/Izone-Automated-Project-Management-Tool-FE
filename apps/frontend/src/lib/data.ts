import {
  LayoutDashboard,
  Users2,
  Clock,
  BarChart3,
  Shield,
  Zap,
} from "lucide-react";

export const features = [
  {
    icon: LayoutDashboard,
    title: "Intuitive Boards",
    description:
      "Switch between Kanban, List, and Timeline views instantly.",
  },
  {
    icon: Users2,
    title: "Real-time Collaboration",
    description:
      "Live cursors, instant updates, seamless teamwork.",
  },
  {
    icon: Clock,
    title: "Time Tracking",
    description:
      "Understand exactly where your team's time goes.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Beautiful charts and automated reports.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "SSO, encryption, and granular permissions.",
  },
  {
    icon: Zap,
    title: "Automated Workflows",
    description:
      "Automate repetitive tasks with powerful triggers.",
  },
];

export const plans = [
  {
    name: "Starter",
    price: "0",
    features: ["3 projects", "Unlimited tasks", "Basic analytics"],
  },
  {
    name: "Pro",
    price: "12",
    highlighted: true,
    features: [
      "Unlimited projects",
      "Advanced reporting",
      "Time tracking",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Unlimited everything", "SSO", "Audit logs"],
  },
];