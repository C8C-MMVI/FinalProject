import { Link, useLocation } from "react-router-dom";

function Sidebar({ isOpen }) {
  const location = useLocation();

  const sections = [
    {
      title: "Dashboard",
      items: [
        { icon: "dashboard", text: "Dashboard", link: "/dashboard" }
      ]
    },
    {
      title: "Inventory",
      items: [
        { icon: "category", text: "Categories", link: "/categories" },
        { icon: "inventory_2", text: "Products", link: "/products" },
        { icon: "box", text: "Stock Records", link: "/stock" },
        { icon: "warehouse", text: "Suppliers", link: "/suppliers" }
      ]
    },
    {
      title: "Sales",
      items: [
        { icon: "point_of_sale", text: "Point of Sales", link: "/pos" },
        { icon: "finance", text: "Transactions", link: "/transactions" }
      ]
    },
    // {
    //   title: "Users",
    //   items: [
    //     { icon: "user_attributes", text: "User Accounts", link: "/usersettings" },
    //     { icon: "account_box", text: "User Profile", link: "/profile" }
    //   ]
    // },
  ];

  return (
    <div
      className={`${
        isOpen ? "w-72" : "w-0"
      } bg-[#4C763B] text-white transition-all duration-300 overflow-hidden flex flex-col justify-between`}
    >
      {/* Logo */}
      <div className="flex justify-center items-center h-20 border-b border-white/20">
        <img src="/ARK.png" alt="ARK Logo" className="h-16 w-auto" />
      </div>

      {/* Sections */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll">
        {sections.map((section, idx) => (
          <div key={idx} className="mt-4">
            <h3 className="px-6 text-sm font-bold text-white mb-2 uppercase tracking-wide font-nunito text-[16px] ">
              {section.title}
            </h3>

            {section.items.map((item, i) => (
              <Link
                key={i}
                to={item.link}
                className={`flex items-center mx-2 my-1 px-6 py-1 rounded font-lexend font-bold transition-colors
                ${
                  location.pathname === item.link
                    ? "bg-white text-[#4C763B] border-l-4 border-[#B8C4A9]"
                    : "bg-[#B8C4A9] text-[#4C763B] hover:bg-white"
                }`}
              >
                <span className="material-symbols-outlined text-2xl mr-3">
                  {item.icon}
                </span>
                {item.text}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 text-center text-xs text-white/60 font-lexend">
        <p>© 2025 ARK Agri Trading</p>
        <p>Program made by BSIT-II students of LORMA Colleges</p>
         
      </div>
    </div>
  );
}

export default Sidebar;
