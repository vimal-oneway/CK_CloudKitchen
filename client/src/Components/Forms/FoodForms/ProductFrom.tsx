import axios from "axios";
import { useState } from "react";

function ProductFrom() {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState<string>();
  const cloudName: string = "dd39ktpmz";
  const presetName: string = "jnniwa4k";

  return (
    <div className=" mx-auto w-[80%] max-w-[1000px]  flex-col">
      <div className="mx-auto flex items-center justify-center">
        <div className="mr-[5%]  w-[45%]">
          <h3 className="bigText">Add your food product</h3>
          <p className="para mt-1 ">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt
            nisi facere sunt possimus temporibus porro soluta cumque, unde
            exercitationem quam consequatur quibusdam obcaecati sequi sapiente
            labore rerum mollitia aliquam dicta?
          </p>
        </div>

        <div className="flex w-[50%] flex-col">
          <p className="mt-4  ">Food details</p>
          <input
            placeholder="Title"
            type="text"
            className="textBox"
            name="title"
            id="tile"
          />

          <input
            type="number"
            placeholder="Price in INR"
            name="price"
            id="price"
            className="textBox"
          />

          <div
            className={`select-menu mt-4 w-[100%] border-solid border-[#ff7e8b] ${
              isOpen ? "active" : ""
            }`}
            onClick={() => {
              setIsOpen((prev) => (prev = !prev));
            }}
          >
            <div className="select-btn">
              <span className="sBtn-text">{value}</span>
              <i
                className={`fa-solid fa-chevron-down  ${
                  isOpen ? "rotate" : "reverse-rotate"
                }`}
                style={{ color: "#ff7e8b" }}
              ></i>
            </div>
            <ul className="options  w-[50%] border-2 ">
              <li
                className="option"
                onClick={(event) => {
                  setValue("Puducherry");
                }}
              >
                <span className="option-text">Puducherry</span>
              </li>
              <li
                className="option"
                onClick={(event) => {
                  setValue("Villupuram");
                }}
              >
                <span className="option-text">Villupuram</span>
              </li>
            </ul>
          </div>

          <textarea
            name="description"
            id="description"
            className="textBox h-[8rem]"
            cols={30}
            rows={10}
            placeholder="Description of your Food"
          ></textarea>

          <p className="mt-4">Food selling time.</p>
          <div className="mt-1 w-[100%]">
            <label htmlFor="open">Open</label>
            <input type="time" name="open" id="open" className="textBox mt-2" />
          </div>

          <div className="mt-2 w-[100%]">
            <label htmlFor="close">Close</label>
            <input
              type="time"
              name="close"
              id="close"
              className="textBox mt-2"
            />
          </div>

          {/* <ImageSelector /> */}

          <button className="btn-full">Submit</button>
        </div>
      </div>
    </div>
  );
}

export default ProductFrom;
