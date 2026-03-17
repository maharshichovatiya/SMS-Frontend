export interface MenuItem {
  icon: string;
  label: string;
  path: string;
  badge?: string;
  badgeColor?: string;
}

export interface ProfessionalIcon {
  icon: string;
  label: string;
  color: string;
  bg: string;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export interface RoleMenus {
  [key: string]: MenuSection[];
}

export const SIDEBAR_MENUS: RoleMenus = {
  admin: [
    {
      title: "Overview",
      items: [
        {
          icon: "Home",
          label: "Dashboard",
          path: "/dashboard",
        },
      ],
    },
    {
      title: "Modules",
      items: [
        {
          icon: "Users",
          label: "Teachers",
          path: "/teachers",
          badge: "86",
          badgeColor: "bg-[var(--green)]",
        },
        {
          icon: "GraduationCap",
          label: "Students",
          path: "/students",
          badge: "1.2k",
          badgeColor: "bg-[var(--blue)]",
        },
        {
          icon: "BookOpen",
          label: "Subjects",
          path: "/subjects",
        },
        {
          icon: "Building",
          label: "Classes",
          path: "/classes",
        },
      ],
    },
    {
      title: "General",
      items: [
        {
          icon: "UserCircle",
          label: "Profile",
          path: "/profile",
        },
      ],
    },
  ],
  teacher: [
    {
      title: "Overview",
      items: [
        {
          icon: "Home",
          label: "Dashboard",
          path: "/teacherview/dashboard",
        },
      ],
    },
    {
      title: "Modules",
      items: [
        {
          icon: "Building",
          label: "Notifications",
          path: "/teacherview/notifications",
        },
        {
          icon: "Building",
          label: "Resources",
          path: "/teacherview/resources",
        },
        {
          icon: "UserCircle",
          label: "Profile",
          path: "/teacherview/profile",
        },
      ],
    },
  ],
  student: [
    {
      title: "Overview",
      items: [
        {
          icon: "Home",
          label: "Dashboard",
          path: "/dashboard",
        },
      ],
    },
    {
      title: "Modules",
      items: [
        {
          icon: "Building",
          label: "Classes",
          path: "/classes",
        },
        {
          icon: "BookOpen",
          label: "Subjects",
          path: "/subjects",
        },
        {
          icon: "UserCircle",
          label: "Profile",
          path: "/profile",
        },
      ],
    },
  ],
};

export const DEFAULT_MENU = SIDEBAR_MENUS.admin;
