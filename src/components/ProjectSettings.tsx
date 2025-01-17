import React, { useState } from "react";

interface ProjectSettingsProps {
  onSubmit: (startDate: string | null, endDate: string | null) => void;
}

const ProjectSettings: React.FC<ProjectSettingsProps> = ({ onSubmit }) => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const handleSubmit = () => {
    onSubmit(startDate, endDate);
  };

  return (
    <div className="flex flex-col justify-start">
      <p className=" ">Select a period for analysis and click the button.</p>
      <p className="mb-2">
        <span className="text-red-600">Warning!</span> If no period is selected,
        the system will load all tickets available in the project. This may take
        a long time!
      </p>
      <div className="flex gap-2 flex-col w-[25%]">
        <label htmlFor="startDate">Start Date:</label>
        <input
          id="startDate"
          type="date"
          className="border rounded p-2 h-fit text-black"
          value={startDate || ""}
          onChange={(e) => setStartDate(e.target.value || null)}
        />

        <label htmlFor="endDate">End Date:</label>
        <input
          id="endDate"
          type="date"
          className="border rounded p-2 h-fit text-black"
          value={endDate || ""}
          onChange={(e) => setEndDate(e.target.value || null)}
        />

        <button
          className="px-4 py-2 mt-2 rounded bg-blue-700 text-white hover:bg-foreground hover:text-background"
          onClick={handleSubmit}
        >
          Get Tickets for Analyze
        </button>
      </div>
    </div>
  );
};

export default ProjectSettings;
