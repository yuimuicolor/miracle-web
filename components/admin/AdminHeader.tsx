export function AdminHeader({ title, subtitle, tip }: any) {
  return (
    <div className="flex flex-col gap-2">
        <h2 className="text-admin-title font-bold">{title}</h2>
        <p className="text-admin-body text-slate-500">{subtitle}</p>
        <p className="text-admin-body font-semibold text-blue-500">
          {tip}
        </p>
    </div>
  );
}
