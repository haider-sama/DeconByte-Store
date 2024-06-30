import { FaSteam } from "react-icons/fa"
import { FaComputer } from "react-icons/fa6"
import { GiConsoleController } from "react-icons/gi"
import { MdCardGiftcard, MdStorefront } from "react-icons/md"

export const categories = [
    {
        label: "All",
        icon: MdStorefront
    },
    {
        label: "PC Games",
        icon: FaComputer
    },
    {
        label: "Console Games",
        icon: GiConsoleController
    },
    {
        label: "Steam Giftcard",
        icon: FaSteam
    },
    {
        label: "Giftcards",
        icon: MdCardGiftcard
    },
]