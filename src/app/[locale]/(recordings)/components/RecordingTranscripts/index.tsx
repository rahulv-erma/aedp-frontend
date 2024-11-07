"use client";

import { Card, CardBody, Input } from "@nextui-org/react";
import {
  ChangeEventHandler,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { IoIosSearch } from "react-icons/io";

import InfiniteScroll from "@/components/InfiniteScroll";
import TranscriptItem from "@/components/Transcript/TranscriptItem";
import useDebounce from "@/hooks/useDebounce";
import { useI18n } from "@/i18n/client";
import { RecordingTranscript } from "@/types";
import { calculateEndTime } from "@/utils";
import { showToast } from "@/utils/toast";

import {
  addTranscript,
  getRecordingTranscripts,
  updateTranscript,
} from "../../actions";
import { TranscriptContext } from "../../contexts/TranscriptContext";
import TranscriptsSkeleton from "../../skeletons/TranscriptsSkeleton";

export type RecordingTranscriptWithEditing = RecordingTranscript & {
  isAdding?: boolean;
};

type RecordingTranscriptProps = {
  recordingId: number;
  onTranscriptSelection: (transcript: RecordingTranscript) => void;
};

export default function RecordingTranscripts({
  recordingId,
  onTranscriptSelection,
}: RecordingTranscriptProps) {
  const t = useI18n();
  const [isLoading, setIsLoading] = useState(true);
  const [isScrollLoading, setIsScrollLoading] = useState(false);
  const [transcripts, setTranscripts] = useState<
    RecordingTranscriptWithEditing[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showArrow, setShowArrow] = useState<boolean>(false);
  const debouncedSearchKeyword = useDebounce(searchKeyword, 500);

  const { setSelectedTextTranscriptId, selectedTextTranscriptId } =
    useContext(TranscriptContext);

  const fetchTranscripts = useCallback(
    async (page: number = 1) => {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsScrollLoading(true);
      }

      const response = await getRecordingTranscripts(
        recordingId,
        page,
        debouncedSearchKeyword,
      );

      if (response.success && response.data) {
        const fetchedTranscripts = response.data.results.map(
          (transcript: RecordingTranscript) => ({
            ...transcript,
          }),
        );

        if (page === 1) {
          setTranscripts(fetchedTranscripts);
        } else {
          setTranscripts((prevTranscripts) => [
            ...prevTranscripts,
            ...fetchedTranscripts,
          ]);
        }

        setHasMore(!!response.data.next);
      }

      setIsScrollLoading(false);
      setIsLoading(false);
    },
    [recordingId, debouncedSearchKeyword],
  );

  useEffect(() => {
    fetchTranscripts();
  }, [fetchTranscripts]);

  const fetchMoreTranscripts = () => {
    if (!hasMore) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchTranscripts(nextPage);
  };

  const handleAddNewTranscriptBubble = (
    transcript: RecordingTranscript,
    position: "up" | "down",
  ) => {
    const index = transcripts.findIndex((trans) => trans.id === transcript.id);

    const newTranscript: RecordingTranscriptWithEditing = {
      // Temporary info. Will be updated as soon as the new transcript is saved in BE
      id: `${Date.now()}`,
      text: "",
      speaker_name: transcript.speaker_name,
      speaker_type: transcript.speaker_type,
      start_time:
        position === "up"
          ? transcript.start_time
          : transcript?.end_time || "00:00",
      isAdding: true,
    };

    if (index !== -1) {
      const updatedTranscripts =
        position === "up"
          ? [
              ...transcripts.slice(0, index),
              newTranscript,
              ...transcripts.slice(index),
            ]
          : [
              ...transcripts.slice(0, index + 1),
              newTranscript,
              ...transcripts.slice(index + 1),
            ];

      setTranscripts(
        updatedTranscripts.map((transcript) => ({
          ...transcript,
          isAdding: transcript.id === newTranscript.id,
        })),
      );
      setSelectedTextTranscriptId(null);
    }
  };

  const handleAddEditTranscript = async (
    transcriptId: string,
    newText: string,
    isEditMode: boolean = false,
  ) => {
    try {
      const transcriptIndex = transcripts.findIndex(
        (transcript) => transcript.id === transcriptId,
      );

      if (transcriptIndex === -1) {
        showToast("error", t("recording.transcript.notFound"));
        return;
      }

      // Clone the transcript and update the text
      const transcript = { ...transcripts[transcriptIndex], text: newText };

      let addEditTranscriptResponse = null;

      if (isEditMode) {
        // Update existing transcript
        addEditTranscriptResponse = await updateTranscript(transcript);
      } else {
        // Add new transcript with calculated end_time
        const newTranscript = {
          ...transcript,
          end_time: calculateEndTime(newText, transcript.start_time),
          isAdding: false,
        };
        addEditTranscriptResponse = await addTranscript(
          recordingId,
          newTranscript,
        );
      }

      if (addEditTranscriptResponse?.success) {
        // Update state with the modified transcript
        const updatedTranscripts = [...transcripts];
        updatedTranscripts[transcriptIndex] =
          addEditTranscriptResponse.data || transcript;
        setTranscripts(updatedTranscripts);
        showToast("success", t("recording.transcript.saveSuccess"));
      } else {
        showToast("error", t("recording.transcript.saveError"));
      }
    } catch (error) {
      console.error("Error saving transcript:", {
        transcriptId,
        newText,
        isEditMode,
        error,
      });
      showToast("error", t("recording.transcript.saveError"));
    }
  };

  const handleTranscriptSearchInputChange: ChangeEventHandler<
    HTMLInputElement
  > = (event) => {
    setSearchKeyword(event.target.value);
  };

  const onSpeakerNameUpdated = (
    updatedSpeakerName: string,
    speakerType: RecordingTranscript["speaker_type"],
  ) => {
    setTranscripts((prevTranscripts) =>
      prevTranscripts.map((transcript) => {
        if (transcript.speaker_type === speakerType) {
          return { ...transcript, speaker_name: updatedSpeakerName };
        }
        return transcript;
      }),
    );
  };

  return (
    <Card
      classNames={{ base: "h-full py-4 pl-4" }}
      aria-label="Transcripts Card"
    >
      <CardBody>
        <div className="mr-8">
          <Input
            size="lg"
            placeholder={t("recording.transcript.search")}
            classNames={{
              inputWrapper: "px-6",
              input: "placeholder:text-pewter text-sm",
            }}
            endContent={<IoIosSearch size={20} className="text-pewter" />}
            onChange={handleTranscriptSearchInputChange}
          />
        </div>
        {isLoading ? (
          <div className="mt-8">
            <TranscriptsSkeleton />
          </div>
        ) : (
          <InfiniteScroll
            loadMore={fetchMoreTranscripts}
            loader={
              <div className="mt-8">
                <TranscriptsSkeleton />
              </div>
            }
            loading={isScrollLoading}
          >
            {transcripts.map((transcript, idx) => (
              <TranscriptItem
                key={idx}
                transcript={transcript}
                isAddingNewTranscript={transcript.isAdding || false}
                isNewTranscriptArrowButtonsShowing={showArrow}
                toggleNewTranscriptArrowButtons={() => {
                  setShowArrow(true);
                  setSelectedTextTranscriptId(
                    transcript.id === selectedTextTranscriptId
                      ? null
                      : transcript.id,
                  );
                }}
                handleAddNewTranscriptBubble={handleAddNewTranscriptBubble}
                handleAddEditTranscript={handleAddEditTranscript}
                onTranscriptSelection={onTranscriptSelection}
                onSpeakerNameUpdated={onSpeakerNameUpdated}
                transcripts={transcripts}
                setTranscripts={setTranscripts}
              />
            ))}
          </InfiniteScroll>
        )}
      </CardBody>
    </Card>
  );
}
