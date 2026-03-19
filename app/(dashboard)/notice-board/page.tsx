"use client";
import PageHeader from "@/components/layout/PageHeader";
import { useState } from "react";
import { Megaphone, Plus } from "lucide-react";
import NoticeCard from "@/components/notice-board/NoticeCard";
import NoticeFilter from "@/components/notice-board/NoticeFilter";
import NoticeSearch from "@/components/notice-board/NoticeSearch";
import NoticeFormModal from "@/components/notice-board/NoticeFormModal";
import { Notice, NoticeFilterType } from "@/lib/types/Notice";

const mockNotices: Notice[] = [
  {
    id: "1",
    type: "Exam Notice",
    icon: "FileText",
    title: "Mid-Term Examination Schedule",
    body: "Mid-term exams will begin from March 20, 2026. Detailed schedule has been shared with class teachers. Students must carry their hall tickets.",
    priority: "high",
    borderColor: "#ef4444",
    iconColor: "#ef4444",
    hasAttachment: true,
    author: "Admin",
    date: "Mar 5",
  },
  {
    id: "2",
    type: "Holiday Notice",
    icon: "Calendar",
    title: "Holi Festival Holiday",
    body: "School will remain closed on March 14-15, 2026 on account of Holi festival. Regular classes resume on March 16.",
    priority: "medium",
    borderColor: "#22c55e",
    iconColor: "#22c55e",
    hasAttachment: false,
    author: "Admin",
    date: "Mar 3",
  },
  {
    id: "3",
    type: "General Notice",
    icon: "Megaphone",
    title: "Annual Day Rehearsals",
    body: "Annual day rehearsals will start from March 25. Students participating in cultural programs should report to the auditorium during activity period.",
    priority: "low",
    borderColor: "#3b82f6",
    iconColor: "#3b82f6",
    hasAttachment: false,
    author: "Meera Gupta",
    date: "Mar 2",
  },
  {
    id: "4",
    type: "Event Notice",
    icon: "PartyPopper",
    title: "Science Exhibition 2026",
    body: "Inter-school Science Exhibition will be held on April 5-6, 2026. Interested students should register with their science teachers by March 22.",
    priority: "medium",
    borderColor: "#f59e0b",
    iconColor: "#f59e0b",
    hasAttachment: true,
    author: "Vivek Pandey",
    date: "Mar 1",
  },
];

function Page() {
  const [selectedFilter, setSelectedFilter] = useState<NoticeFilterType>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [notices, setNotices] = useState<Notice[]>(mockNotices);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const filteredNotices = notices.filter(notice => {
    const matchesFilter =
      selectedFilter === "all" ||
      notice.type.toLowerCase().includes(selectedFilter.toLowerCase());
    const matchesSearch =
      searchQuery === "" ||
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.type.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handlePostNotice = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleNoticeCreated = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Notice Board"
        description="Announcements, events, holidays and exam notices"
        icon={Megaphone}
        iconBgColor="--amber-light"
        iconColor="--amber"
        buttonText="Post Notice"
        onButtonClick={handlePostNotice}
        buttonIcon={Plus}
      />

      <div className="flex items-center justify-between gap-4 mt-6 px-4">
        <NoticeFilter
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />

        <NoticeSearch value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotices.map((notice, index) => (
          <NoticeCard key={notice.id} notice={notice} index={index} />
        ))}
      </div>

      <NoticeFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmitSuccess={handleNoticeCreated}
      />
    </div>
  );
}

export default Page;
