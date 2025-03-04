
import RotatingText from "./RotatingText"


function App() {


  return (
    <>
      <div className=" flex w-screen  items-center relative flex-col">
        
        <div className="flex gap-4 items-center mt-10 max-sm:flex-col">
          <div className="text-white font-bold text-2xl text-nowrap ">Welcome to p2p file sharer</div>
          <div className="w-[150px] font-bold ">
            <RotatingText
              texts={['Share', 'Download', 'Peer to Peer', 'No data stored', 'Enjoy!']}
              mainClassName="px-2 sm:px-2 md:px-3 bg-white text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
              staggerFrom={"last"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
          </div>
        </div>

       <div className=" text-center mt-7 max-sm:text-start p-6 relative max-sm:mt-3">
        <p >Our P2P File Sharer is designed to provide a lightweight, efficient, and decentralized way<br /> to transfer files directly between users without relying on third-party servers.<br /> Whether you’re sharing documents, images, or large media files,<br /> our platform ensures fast, encrypted, and real-time file transfers using WebRTC technology.</p>
       </div>

      </div>
      


    </>
  )
}

export default App
