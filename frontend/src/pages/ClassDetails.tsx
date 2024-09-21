import { useParams } from 'react-router-dom';
import NavLayout from '../layouts/NavLayout'
import { useEffect, useState } from 'react';
import { ClassLogsResponse } from '../types/pocketbase';
import { TexpandStudentWithPackage } from '../types/extend';
import { usePocket } from '../contexts/PocketContext';

export const ClassDetails = () => {
    const { id = "" }= useParams();
    const {getClassLogDataById} = usePocket()

    const [classLog, setClassLog] = useState<ClassLogsResponse<TexpandStudentWithPackage>>()

    useEffect(() => {
      if(id.length == 0) return;

      getClassLogDataById({id}).then(res => setClassLog(res))
    }, [id])
    

    return (
        <NavLayout>
            <div className="p-5 md:p-16 w-full">
                {JSON.stringify(classLog)}
            </div>
        </NavLayout>
    )
}
