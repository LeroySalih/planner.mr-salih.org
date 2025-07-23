import { DisplayActivityProps } from "./types";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";


const images = [
  {
    original: "/api/activity/1/",
    thumbnail: "/api/activity/1",
  },
  {
    original: "/api/activity/1",
    thumbnail: "/api/activity/1",
  },
  {
    original: "/api/activity/1",
    thumbnail: "/api/activity/1",
  },
];


const DisplayActivitiesImages = ({activity, editing}: DisplayActivityProps) => {

  

return <div>Images
    <div className="h-[300px] w-full">
    <ImageGallery items={images} />;
    </div>
    </div>

}


export default DisplayActivitiesImages;