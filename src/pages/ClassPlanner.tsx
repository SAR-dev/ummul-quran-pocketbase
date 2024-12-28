import { useState } from 'react';
import { RoutinePlanner } from '../components/RoutinePlanner';
import { ClassLogPlanner } from '../components/ClassLogPlanner';
import NavLayout from '../layouts/NavLayout';
import classNames from 'classnames';

enum ClassPlannerType {
    ROUTINE, CLASS_LOG
}

export const ClassPlanner = () => {
    const [plannerType, setPlannerType] = useState<ClassPlannerType>(ClassPlannerType.CLASS_LOG)

    return (
        <NavLayout>
            <section className="p-5 md:p-16 w-full">
                <div className="card border-2 border-base-300 w-full bg-base-100">
                    <div className="border-b border-base-300 p-5">
                        <div className="join">
                            <button
                                className={classNames({
                                    "btn join-item no-animation": true,
                                    "btn-info": plannerType == ClassPlannerType.ROUTINE
                                })}
                                onClick={() => setPlannerType(ClassPlannerType.ROUTINE)}
                            >
                                Routine Planner
                            </button>
                            <button
                                className={classNames({
                                    "btn join-item no-animation": true,
                                    "btn-info": plannerType == ClassPlannerType.CLASS_LOG
                                })}
                                onClick={() => setPlannerType(ClassPlannerType.CLASS_LOG)}
                            >
                                Class Planner
                            </button>
                        </div>
                    </div>
                    <div className="p-5">
                        {plannerType == ClassPlannerType.ROUTINE && (
                            <RoutinePlanner />
                        )}
                        {plannerType == ClassPlannerType.CLASS_LOG && (
                            <ClassLogPlanner />
                        )}
                    </div>
                </div>
            </section>
        </NavLayout>
    )
}
