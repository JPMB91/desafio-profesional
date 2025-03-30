export const UserAvatar = ({ name }) => {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="rounded-full bg-[var(--color-accent-secondary)] w-10 h-10 flex items-center justify-center">
      <span className="text-white font-bold text-lg">{initials}</span>
    </div>
  );
};
