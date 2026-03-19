"use client";
import PageHeader from "@/components/layout/PageHeader";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "@/lib/store/Index";
import { RootState } from "@/lib/store/Index";
import { fetchNotices, clearError } from "@/lib/store/NoticeSlice";
import { Megaphone, Plus } from "lucide-react";
import NoticeCard from "@/components/notice-board/NoticeCard";
import NoticeFilter from "@/components/notice-board/NoticeFilter";
import NoticeSearch from "@/components/notice-board/NoticeSearch";
import NoticeFormModal from "@/components/notice-board/NoticeFormModal";
import NoticeDeleteModal from "@/components/notice-board/NoticeDeleteModal";
import { NoticeFilterType, Notice, ApiNotice } from "@/lib/types/Notice";
import { removeNotice } from "@/lib/store/NoticeSlice";
import { showToast } from "@/lib/utils/Toast";

function Page() {
  const [selectedFilter, setSelectedFilter] = useState<NoticeFilterType>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedNotice, setSelectedNotice] = useState<ApiNotice | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [noticeToDelete, setNoticeToDelete] = useState<Notice | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const { notices, apiNotices, loading, error } = useSelector(
    (state: RootState) => state.notices,
  );
  const userRole = useSelector((state: RootState) => state.auth.role);
  const isStudent = userRole === "student";

  useEffect(() => {
    dispatch(fetchNotices());
  }, [dispatch]);

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
    setSelectedNotice(null);
    setIsModalOpen(true);
  };

  const handleEditNotice = (notice: Notice) => {
    const apiNotice = apiNotices.find(n => n.id === notice.id) || null;
    setSelectedNotice(apiNotice);
    setIsModalOpen(true);
  };

  const handleDeleteNoticeClick = (notice: Notice) => {
    setNoticeToDelete(notice);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!noticeToDelete) return;
    setIsDeleting(true);
    try {
      const result = await dispatch(removeNotice(noticeToDelete.id));
      if (removeNotice.fulfilled.match(result)) {
        showToast.success("Notice deleted successfully");
      } else {
        throw new Error(
          (result.payload as string) || "Failed to delete notice",
        );
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete notice";
      showToast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setNoticeToDelete(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedNotice(null);
  };

  const handleNoticeCreated = () => {
    setIsModalOpen(false);
    setSelectedNotice(null);
  };

  const getInitialTargetType = () => {
    if (
      !initialData ||
      !initialData.noticeTargets ||
      initialData.noticeTargets.length === 0
    )
      return undefined;
    const targetInfo = initialData.noticeTargets[0] as {
      targetType: string;
      targetId: string;
    };
    return targetInfo.targetType as "school" | "class" | "teacher" | undefined;
  };

  const handleRetry = () => {
    dispatch(clearError());
    dispatch(fetchNotices());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Notice Board"
        description="Announcements, events, holidays and exam notices"
        icon={Megaphone}
        iconBgColor="--amber-light"
        iconColor="--amber"
        {...(!isStudent && {
          buttonText: "Post Notice",
          onButtonClick: handlePostNotice,
          buttonIcon: Plus,
        })}
      />

      <div className="flex items-center justify-between gap-4 mt-6 px-4">
        <NoticeFilter
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />

        <NoticeSearch value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotices.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500 text-lg">No notices found</div>
            <p className="text-gray-400 mt-2">
              {searchQuery || selectedFilter !== "all"
                ? "Try adjusting your filters or search"
                : "No notices have been posted yet"}
            </p>
          </div>
        ) : (
          filteredNotices.map((notice, index) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              index={index}
              showActions={!isStudent}
              onEdit={handleEditNotice}
              onDelete={handleDeleteNoticeClick}
            />
          ))
        )}
      </div>

      {!isStudent && (
        <>
          <NoticeFormModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSubmitSuccess={handleNoticeCreated}
            notice={selectedNotice}
          />
          <NoticeDeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            notice={noticeToDelete}
            onConfirm={handleConfirmDelete}
            isDeleting={isDeleting}
          />
        </>
      )}
    </div>
  );
}

export default Page;
