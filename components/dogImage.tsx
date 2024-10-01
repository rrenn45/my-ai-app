import Image from "next/image"

export default async function DogImage({breed} :{breed:string}){
    let data = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
  let img = await data.json()
  console.log(img)
    return(
        <Image src={img?.message} alt="dogpic" width={500} height={500} />
    )
}
