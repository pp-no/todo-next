// サイドナビ
import NavList from "./NavList/NavList"

const SideMenu = () => {
  return (
    <nav className="md:block hidden w-56 pt-8 bg-gray-800 text-white">
        <div>
            <h1 className="px-4 text-2xl font-bold">ToDo</h1>
            <NavList />
        </div>
    </nav>
  )
}

export default SideMenu
