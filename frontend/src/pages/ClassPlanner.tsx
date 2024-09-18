import { useState } from 'react';
import { RoutinePlanner } from '../components/RoutinePlanner';
import { ClassLogPlanner } from '../components/ClassLogPlanner';

enum ClassPlannerType {
    ROUTINE, CLASS_LOG
}

export const ClassPlanner = () => {
    const [plannerType, setPlannerType] = useState<ClassPlannerType>(ClassPlannerType.CLASS_LOG)
    return (
        <section className="p-5">
            <div className="flex gap-3">
                <button className="btn btn-primary" onClick={() => setPlannerType(ClassPlannerType.ROUTINE)}>Routine Planner</button>
                <button className="btn btn-primary" onClick={() => setPlannerType(ClassPlannerType.CLASS_LOG)}>Log Planner</button>
            </div>
            {plannerType == ClassPlannerType.ROUTINE && (
                <RoutinePlanner />
            )}
            {plannerType == ClassPlannerType.CLASS_LOG && (
                <ClassLogPlanner />
            )}
        </section>
    )
}
