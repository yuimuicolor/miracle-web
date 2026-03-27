export interface NavigationSubmenuItem {
  label: string;
  href: string;
}

export interface NavigationMenuItem {
  title: string;
  href: string;
  submenus: NavigationSubmenuItem[];
}
