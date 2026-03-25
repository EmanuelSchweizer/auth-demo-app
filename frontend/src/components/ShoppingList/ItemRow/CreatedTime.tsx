import { useTimeDifference } from "@/hooks/useTimeDifference";

interface Props {
    timestamp: string;
}

export const CreatedTime = ({ timestamp }: Props) => {
    const { timeAgo } = useTimeDifference(timestamp);

    return (
        <span className="text-xs text-gray-400" aria-label={`created ${timeAgo}`} title={`Created ${timeAgo}`}>
            {timeAgo}
        </span>
    );
}