import { FormEvent, useCallback, useState } from 'react';

export const ClassPlanner = () => {
    const [data, setData] = useState({
        
    })

    const handleOnSubmit = useCallback(
        async (evt: FormEvent<HTMLFormElement>) => {
          evt?.preventDefault();
        //   await login({
        //     email: data.email,
        //     password: data.password
        //   });
        //   navigate("/");
        },
        []
      );

      
    return (
        <section className="p-5">
            <form className='flex flex-col gap-3' onSubmit={handleOnSubmit}>

            </form>
        </section>
    )
}
