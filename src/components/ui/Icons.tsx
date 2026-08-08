type IconProps = {
  className?: string;
};

function Svg({
  children,
  className = "h-5 w-5",
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 5v14M5 12h14" strokeWidth={2.2} />
    </Svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </Svg>
  );
}

export function DotsIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="5" r="1.4" fill="currentColor" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
      <circle cx="12" cy="19" r="1.4" fill="currentColor" />
    </Svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M5 12.5l4.5 4.5L19 7" strokeWidth={2.2} />
    </Svg>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M9 5l7 7-7 7" />
    </Svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M6 9l6 6 6-6" />
    </Svg>
  );
}

export function ArrowLeftIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </Svg>
  );
}

export function TrashIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 7h16M10 7V5h4v2M6 7l1 13h10l1-13" />
    </Svg>
  );
}

export function EditIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 20h4L19 9a2.1 2.1 0 10-3-3L5 17v3z" />
    </Svg>
  );
}

export function SettingsIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 13.5a7.9 7.9 0 000-3l1.7-1.3-1.9-3.3-2 .8a7.8 7.8 0 00-2.6-1.5L14.3 3h-3.8l-.3 2.2a7.8 7.8 0 00-2.6 1.5l-2-.8L3.7 9.2l1.7 1.3a7.9 7.9 0 000 3l-1.7 1.3 1.9 3.3 2-.8a7.8 7.8 0 002.6 1.5l.3 2.2h3.8l.3-2.2a7.8 7.8 0 002.6-1.5l2 .8 1.9-3.3-1.7-1.3z" />
    </Svg>
  );
}

export function AlertIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 9v4.5M12 17h.01" />
      <path d="M10.3 3.9L2.6 17.3A2 2 0 004.3 20.3h15.4a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
    </Svg>
  );
}

export function LinkIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M10 13.5a4 4 0 006 .5l2.5-2.5a4 4 0 00-5.7-5.7L11.5 7" />
      <path d="M14 10.5a4 4 0 00-6-.5L5.5 12.5a4 4 0 005.7 5.7L12.5 17" />
    </Svg>
  );
}

export function DocumentIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" />
      <path d="M14 3v5h5" />
    </Svg>
  );
}

export function SuitcaseIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="3" y="7.5" width="18" height="12.5" rx="2.5" />
      <path d="M8.5 7.5V5.5A1.5 1.5 0 0110 4h4a1.5 1.5 0 011.5 1.5v2" />
    </Svg>
  );
}

export function FilterIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 6h16M7 12h10M10 18h4" />
    </Svg>
  );
}

export function PhotoIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <circle cx="8.5" cy="10" r="1.6" />
      <path d="M4 17l4.5-4.5L12 16l3-3 5 5" />
    </Svg>
  );
}
