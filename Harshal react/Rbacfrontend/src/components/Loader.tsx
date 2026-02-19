import { TailSpin } from "react-loader-spinner"


export function Loader(){
    return (
        <TailSpin
          visible={true}
          height="80"
          width="80"
          color="#3b82f6"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
        />
    )
}