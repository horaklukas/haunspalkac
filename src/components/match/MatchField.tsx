import { FieldData } from "@/lib/scrapper";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { Separator } from "../ui/separator";
import { useTranslations } from "next-intl";

interface MatchFieldProps {
    field: FieldData;
}

export const MatchField = ({ field }: MatchFieldProps) => {
    const t = useTranslations('field')

    return (
        <Popover>
            <PopoverTrigger className="ml-1 text-sm text-slate-400 md:ml-4">
                {field.name}
            </PopoverTrigger>
            <PopoverContent>
                <h4 className="mb-1 text-lg">
                    {field.name} ({field.abbr})
                </h4>
                <Separator className="mb-2" />
                <p className="mb-2">{field.address}</p>
                <p className="mb-2">{field.info}</p>

                <a
                    target="_blank"
                    href={field.link}
                    className="text-sm break-words d-block hover:text-yellow-600"
                >
                    {t('openMap')}
                </a>
            </PopoverContent>
        </Popover>
    );
};
