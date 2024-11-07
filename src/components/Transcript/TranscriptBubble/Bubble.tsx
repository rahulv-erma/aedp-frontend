"use client";

import clsx from "clsx";
import { useParams } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  addTranscript,
  updateTranscript,
} from "@/app/[locale]/(recordings)/actions";
import { RecordingTranscriptWithEditing } from "@/app/[locale]/(recordings)/components/RecordingTranscripts";
import { TranscriptContext } from "@/app/[locale]/(recordings)/contexts/TranscriptContext";
import { SPEAKER_TYPE } from "@/enums/recording";
import { RecordingTranscript, TranscriptSelectedTextRange } from "@/types";
import { calculateEndTime } from "@/utils";

import TranscriptBubbleContainer from "./BubbleContainer";
import TranscriptActionButtons from "./Buttons/ActionButtons";

type BubbleProps = {
  transcript: RecordingTranscript;
  handleBubbleEdit: (selectedText: string) => void;
  transcripts: RecordingTranscriptWithEditing[];
  setTranscripts: Dispatch<SetStateAction<RecordingTranscriptWithEditing[]>>;
};

export default function Bubble({
  transcript,
  handleBubbleEdit,
  transcripts,
  setTranscripts,
}: BubbleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActionsVisible, setActionsVisibility] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [actionsTopOffset, setActionsTopOffset] = useState(0);
  const [actionsLeftOffset, setActionsLeftOffset] = useState(0);
  const [selectedTextRangeTmp, setSelectedTextRangeTmp] =
    useState<TranscriptSelectedTextRange | null>(null);
  const {
    selectedTextTranscriptId,
    selectedTextRange,
    selectedText: selectedTextCont,
    setSelectedText: setSelectedTextCont,
    setSelectedTextRange,
    setSelectedTextTranscriptId,
  } = useContext(TranscriptContext);
  const { recordingId } = useParams<{ recordingId: string }>();

  const showActions = useCallback((selectedText: string) => {
    setSelectedText(selectedText);
    setActionsVisibility(true);
  }, []);

  const hideActions = useCallback(() => {
    setTimeout(() => {
      setSelectedText("");
      setActionsVisibility(false);
    }, 1);
  }, []);

  const getNodePath = (
    node: Node | undefined,
    container: HTMLDivElement | null,
  ) => {
    const path = [];
    while (node && node !== container) {
      let index = 0;
      let sibling = node.previousSibling;
      while (sibling) {
        if (sibling.nodeType === 1 || sibling.nodeType === 3) index++;
        sibling = sibling.previousSibling;
      }
      path.unshift(index);
      node = node.parentNode as Node;
    }
    return path;
  };

  const validateOffset = (node: Node, offset: number) => {
    const nodeLength =
      node.nodeType === 3
        ? node.nodeValue?.length ?? 0
        : node.childNodes.length;
    return Math.min(offset, nodeLength);
  };

  const onMouseUpText = useCallback(() => {
    const selection = window.getSelection();
    const selectionText = selection?.toString();

    setSelectedTextRangeTmp(null);

    if (!selectionText || selectionText === selectedText) {
      hideActions();
      return;
    }
    if (!!transcript.text?.includes(selectionText)) {
      const range = selection?.getRangeAt(0);
      const selectionRange: TranscriptSelectedTextRange = {
        startOffset: range?.startOffset ?? 0,
        endOffset: range?.endOffset ?? 0,
        startContainerPath: getNodePath(
          range?.startContainer,
          containerRef.current,
        ),
        endContainerPath: getNodePath(
          range?.endContainer,
          containerRef.current,
        ),
      };

      clearPreviousHighlights();
      setSelectedTextRange(null);
      setSelectedTextCont(null);
      setSelectedTextTranscriptId(null);
      setSelectedTextRangeTmp(selectionRange);
      showActions(selectionText);
    }
  }, [
    transcript.text,
    selectedText,
    showActions,
    hideActions,
    setSelectedTextCont,
    setSelectedTextRange,
    setSelectedTextTranscriptId,
  ]);

  const onMouseMoveText = useCallback(
    (event: any) => {
      if (!isActionsVisible) {
        const rect = event.currentTarget.getBoundingClientRect();
        setActionsLeftOffset(event.clientX - rect.left - 15);
        setActionsTopOffset(event.clientY - rect.top + 35);
      }
    },
    [isActionsVisible],
  );

  const getNodeFromPath = (
    path: number[],
    container: HTMLDivElement | null,
  ) => {
    let node: any = container;
    path.forEach((index: number) => {
      node = node?.childNodes[index];
    });
    return node;
  };

  const onClickEditIcon = () => {
    handleBubbleEdit(selectedText);
  };

  const makeTextHighlighted = useCallback(
    (selectedRange: TranscriptSelectedTextRange) => {
      const { startOffset, endOffset, startContainerPath, endContainerPath } =
        selectedRange;

      const startContainer = getNodeFromPath(
        startContainerPath,
        containerRef.current,
      );
      const endContainer = getNodeFromPath(
        endContainerPath,
        containerRef.current,
      );

      if (startContainer && endContainer) {
        const range = document.createRange();

        const validStartOffset = validateOffset(startContainer, startOffset);
        const validEndOffset = validateOffset(endContainer, endOffset);

        range.setStart(startContainer, validStartOffset);
        range.setEnd(endContainer, validEndOffset);

        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);

        const span = document.createElement("span");
        span.classList.add("highlight_bubble");
        span.classList.add("inline-block");
        span.classList.add("bg-[#B1D4FB]");
        span.appendChild(range.cloneContents());

        range.deleteContents();
        range.insertNode(span);
      }
    },
    [],
  );

  const clearPreviousHighlights = () => {
    const highlightedElements = document.querySelectorAll(".highlight_bubble");

    highlightedElements?.forEach((highlight) => {
      const parent = highlight.parentNode;
      while (highlight.firstChild) {
        parent?.insertBefore(highlight.firstChild, highlight);
      }
      parent?.removeChild(highlight);
    });
  };

  const seperateSelectedText = useCallback(async () => {
    const allTranscripts = transcripts;

    const currentTranscript = transcript;
    const currentTranscriptIndex = allTranscripts.findIndex(
      (t) => t.id === currentTranscript.id,
    );

    const updatedTranscripts = allTranscripts.slice(0, currentTranscriptIndex);

    const newTranscriptBase = {
      id: Date.now().toString(),
      speaker_name: currentTranscript.speaker_name,
      speaker_type: currentTranscript.speaker_type,
      isAdding: false,
    };

    const seperatedTranscriptText = currentTranscript.text.split(selectedText);
    const isStartSelected = seperatedTranscriptText[0] === "";
    const isMiddleSelected =
      seperatedTranscriptText[0] !== "" && seperatedTranscriptText[1] !== "";
    const isEndSelected = seperatedTranscriptText[1] === "";

    if (isStartSelected) {
      const transcript1 = {
        ...newTranscriptBase,
        text: selectedText,
        start_time: currentTranscript.start_time,
        end_time: calculateEndTime(selectedText, currentTranscript.start_time),
      };
      await addTranscript(+recordingId, transcript1);

      const transcript2 = {
        ...currentTranscript,
        text: seperatedTranscriptText[1],
        start_time: transcript1.end_time,
        end_time: calculateEndTime(
          seperatedTranscriptText[1],
          transcript1.end_time,
        ),
      };
      await updateTranscript(transcript2);

      updatedTranscripts.push(transcript1, transcript2);
    }

    if (isMiddleSelected) {
      const transcript1 = {
        ...newTranscriptBase,
        text: seperatedTranscriptText[0],
        start_time: currentTranscript.start_time,
        end_time: calculateEndTime(
          seperatedTranscriptText[0],
          transcript.start_time,
        ),
      };
      await addTranscript(+recordingId, transcript1);

      const transcript2 = {
        ...currentTranscript,
        text: selectedText,
        start_time: transcript1.end_time,
        end_time: calculateEndTime(selectedText, transcript1.end_time),
      };
      await updateTranscript(transcript2);

      const transcript3 = {
        ...newTranscriptBase,
        id: (Date.now() + 1).toString(),
        text: seperatedTranscriptText[1],
        start_time: transcript2.end_time,
        end_time: calculateEndTime(
          seperatedTranscriptText[1],
          transcript2.end_time,
        ),
      };
      await addTranscript(+recordingId, transcript3);

      updatedTranscripts.push(transcript1, transcript2, transcript3);
    }

    if (isEndSelected) {
      const transcript1 = {
        ...currentTranscript,
        text: seperatedTranscriptText[0],
        start_time: transcript.start_time,
        end_time: calculateEndTime(
          seperatedTranscriptText[0],
          transcript.start_time,
        ),
      };
      await updateTranscript(transcript1);

      const transcript2 = {
        ...newTranscriptBase,
        text: selectedText,
        start_time: transcript1.end_time,
        end_time: calculateEndTime(selectedText, transcript1.end_time),
      };
      await addTranscript(+recordingId, transcript2);

      updatedTranscripts.push(transcript1, transcript2);
    }

    updatedTranscripts.push(
      ...allTranscripts.slice(currentTranscriptIndex + 1),
    );
    setTranscripts(updatedTranscripts);

    setActionsVisibility(false);
  }, [transcript, selectedText, transcripts, setTranscripts, recordingId]);

  const onClickBookmarkIcon = useCallback(async () => {
    await seperateSelectedText();
    setSelectedTextCont(selectedText);
    setSelectedTextTranscriptId(transcript.id);
    if (selectedTextRangeTmp) {
      makeTextHighlighted(selectedTextRangeTmp);
    }
  }, [
    selectedText,
    makeTextHighlighted,
    selectedTextRangeTmp,
    setSelectedTextCont,
    setSelectedTextTranscriptId,
    transcript.id,
    seperateSelectedText,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(".action-buttons")
      ) {
        hideActions();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [hideActions]);

  useEffect(() => {
    if (
      transcript.id === selectedTextTranscriptId &&
      selectedTextCont &&
      selectedTextRange
    ) {
      makeTextHighlighted(selectedTextRange);
    }
  }, [
    transcript,
    selectedTextRange,
    selectedTextTranscriptId,
    selectedTextCont,
    makeTextHighlighted,
  ]);

  return (
    <TranscriptBubbleContainer speakerType={transcript.speaker_type}>
      <div
        ref={containerRef}
        className={clsx(
          "flex-1 text-[13px] leading-[23px] tracking-[0.2px] relative",
          {
            "text-charcoal": transcript.speaker_type === SPEAKER_TYPE.PATIENT,
            "text-slate-gray":
              transcript.speaker_type === SPEAKER_TYPE.THERAPIST,
          },
        )}
        onMouseUp={onMouseUpText}
        onMouseMove={onMouseMoveText}
      >
        {transcript.text}
      </div>
      {isActionsVisible && (
        <TranscriptActionButtons
          topOffset={actionsTopOffset}
          leftOffset={actionsLeftOffset}
          onClickEditIcon={onClickEditIcon}
          onClickBookmarkIcon={onClickBookmarkIcon}
        />
      )}
    </TranscriptBubbleContainer>
  );
}
