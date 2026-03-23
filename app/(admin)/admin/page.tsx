export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">환영합니다</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "새로운 문의", value: "3건", color: "text-blue-600" },
          { label: "전체 상품", value: "12개", color: "text-green-600" },
          { label: "갤러리 사진", value: "24장", color: "text-purple-600" },
          { label: "방문자 수", value: "120명", color: "text-orange-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-2xl text-gray-500 font-medium">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-2xl font-bold mb-4">공지사항 및 팁</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>문의 사항 중 '미확인' 상태는 가능한 빨리 처리해 주세요.</li>
          <li>사이트 설정 변경 시 실제 사이트에 즉시 반영되니 주의하세요!</li>
        </ul>
      </div>
    </div>
  );
}