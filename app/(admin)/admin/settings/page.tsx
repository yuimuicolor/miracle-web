import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminSettingsPage() {
  return (
    <div>
      <AdminHeader title="사이트 설정" subtitle="사이트의 전반적인 설정을 관리하는 페이지입니다." tip="* 변경사항이 있을 경우 [저장] 버튼을 눌러주세요." />
    </div>
  );
}