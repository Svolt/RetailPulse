import React, { useState } from 'react';
import { 
  CheckSquare, 
  Play, 
  HelpCircle, 
  Award, 
  Clock, 
  CheckCircle2, 
  Upload, 
  X, 
  Sparkles,
  Camera,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TaskItem } from '../../types';

export const TasksTrainingView: React.FC = () => {
  const { tasks, completeTask } = useApp();
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, string>>({});
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [completedSuccess, setCompletedSuccess] = useState(false);

  const handleStartTask = (task: TaskItem) => {
    setSelectedTask(task);
    setSurveyAnswers({});
    setPhotoUploaded(false);
    setCompletedSuccess(false);
  };

  const handleSubmitTask = () => {
    if (!selectedTask) return;
    completeTask(selectedTask.id, surveyAnswers);
    setCompletedSuccess(true);
    setTimeout(() => {
      setSelectedTask(null);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] shadow-2xs">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#172018]">
            Tasks, Surveys & Product Training
          </h1>
          <p className="text-xs text-[#697565] mt-0.5">
            Complete quick brand surveys, storefront merchandising audits, and watch technical videos to earn instant loyalty points.
          </p>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(task => {
          const isDone = task.status === 'approved';

          return (
            <div 
              key={task.id}
              className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] shadow-2xs flex flex-col justify-between hover:border-[#153B2B] transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-[#697565]">
                  <span className="font-semibold text-[#153B2B] uppercase tracking-wider">
                    {task.category.replace('_', ' ')}
                  </span>
                  <span className="flex items-center gap-1 font-tabular">
                    <Clock className="w-3 h-3" /> {task.estimatedMinutes} mins
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#172018] leading-snug">
                  {task.title}
                </h3>

                <p className="text-xs text-[#697565] leading-relaxed line-clamp-3">
                  {task.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F5F7F3] flex items-center justify-between">
                <div className="text-sm font-bold text-[#16A34A] font-tabular">
                  +{task.pointsReward.toLocaleString()} Pts
                </div>

                {isDone ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#16A34A] bg-[#EAF7EE] px-3 py-1.5 rounded-xl">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                  </span>
                ) : (
                  <button
                    onClick={() => handleStartTask(task)}
                    className="px-3.5 py-1.5 text-xs font-bold text-[#153B2B] bg-[#C8F43D] hover:bg-[#BBE832] rounded-xl shadow-2xs transition-transform active:scale-95 cursor-pointer"
                  >
                    Start Task
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
          <div 
            className="w-full max-w-xl bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#E5EAE1] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5EAE1]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#153B2B] text-[#C8F43D] flex items-center justify-center font-bold">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#172018]">{selectedTask.title}</h3>
                  <p className="text-[11px] text-[#697565]">Reward: +{selectedTask.pointsReward} Points</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-1 text-[#697565] hover:text-[#172018] rounded-md hover:bg-[#F5F7F3] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {completedSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#EAF7EE] text-[#16A34A] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-[#172018]">Task Verified & Completed!</h4>
                  <p className="text-xs text-[#697565]">
                    +{selectedTask.pointsReward} loyalty points have been credited to your active wallet.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-[#697565] leading-relaxed">
                    {selectedTask.description}
                  </p>

                  {/* Video Player if training */}
                  {selectedTask.videoUrl && (
                    <div className="rounded-xl overflow-hidden bg-[#172018] relative aspect-video flex items-center justify-center">
                      <video 
                        controls 
                        className="w-full h-full object-cover"
                        src={selectedTask.videoUrl}
                      />
                    </div>
                  )}

                  {/* Photo upload if compliance */}
                  {selectedTask.category === 'display_compliance' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-[#172018]">
                        Capture / Upload Store Display Photo
                      </label>
                      <div 
                        onClick={() => setPhotoUploaded(true)}
                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                          photoUploaded 
                            ? 'border-[#16A34A] bg-[#EAF7EE]' 
                            : 'border-[#DDE4D8] hover:border-[#153B2B] bg-[#FAFBF9]'
                        }`}
                      >
                        {photoUploaded ? (
                          <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#16A34A]">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Storefront Display Photo Attached (Verified Geo-stamp)</span>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <Camera className="w-6 h-6 text-[#153B2B] mx-auto mb-1" />
                            <div className="text-xs font-semibold text-[#172018]">Click to take photo or upload image</div>
                            <div className="text-[10px] text-[#697565]">Must show counter display banner clearly</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Survey / Quiz Questions */}
                  {selectedTask.surveyQuestions && (
                    <div className="space-y-4">
                      {selectedTask.surveyQuestions.map((q, idx) => (
                        <div key={q.id} className="p-3.5 bg-[#FAFBF9] rounded-xl border border-[#E5EAE1] space-y-2 text-xs">
                          <div className="font-semibold text-[#172018]">
                            {idx + 1}. {q.question}
                          </div>
                          <div className="space-y-1.5">
                            {q.options.map((opt) => (
                              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name={q.id}
                                  value={opt}
                                  checked={surveyAnswers[q.id] === opt}
                                  onChange={() => setSurveyAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                  className="text-[#153B2B] focus:ring-[#153B2B]"
                                />
                                <span className="text-[#3E4A3D]">{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F5F7F3]">
                    <button
                      type="button"
                      onClick={() => setSelectedTask(null)}
                      className="px-4 py-2 text-xs font-medium text-[#697565] hover:text-[#172018] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitTask}
                      className="px-5 py-2 text-xs font-bold text-[#153B2B] bg-[#C8F43D] hover:bg-[#BBE832] rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
                    >
                      Submit & Claim Reward
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
