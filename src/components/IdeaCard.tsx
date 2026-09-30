import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, ArrowRight, MessageSquare } from "lucide-react";

export interface Idea {
  id: string;
  title: string;
  domain: string;
  description: string;
  skills?: string[];
  skillsNeeded?: string[];
  creator?: string;
  creatorName?: string;
  funding?: string;
  fundingNeeded?: string;
}

export default function IdeaCard({ idea }: { idea: Idea }) {
  const navigate = useNavigate();
  const displaySkills = idea.skillsNeeded || idea.skills || [];
  const displayCreator = idea.creatorName || idea.creator || "Anonymous Creator";
  const displayFunding = idea.fundingNeeded || idea.funding;

  return (
    <div className="glass rounded-xl p-5 h-full flex flex-col border border-border/40 hover:border-primary/40 transition-all card-lift relative">
      <Link to={`/idea/${idea.id}`} className="flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10 text-xs">
            {idea.domain}
          </Badge>
          {displayFunding && (
            <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">{displayFunding}</span>
          )}
        </div>
        <h3 className="font-display font-semibold text-foreground mb-2 text-base">{idea.title}</h3>
        <p className="text-xs text-muted-foreground mb-4 flex-1 line-clamp-3 leading-relaxed">{idea.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {displaySkills.slice(0, 3).map((skill) => (
            <span key={skill} className="px-2 py-0.5 rounded text-[11px] bg-primary/10 text-primary font-medium">
              {skill}
            </span>
          ))}
          {displaySkills.length > 3 && (
            <span className="px-2 py-0.5 rounded text-[11px] bg-accent text-muted-foreground">
              +{displaySkills.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mb-3">
          <User className="h-3.5 w-3.5 text-primary" />
          {displayCreator}
        </div>
      </Link>

      <div className="flex items-center justify-between pt-3 border-t border-border/30 gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/idea/${idea.id}`);
          }}
          className="text-[11px] h-8 px-2.5 gap-1 border-primary/30 text-primary hover:bg-primary/10"
        >
          <MessageSquare className="h-3 w-3" /> Message
        </Button>

        <Link to={`/idea/${idea.id}`}>
          <Button size="sm" variant="ghost" className="text-[11px] h-8 px-2.5 gap-1 hover:text-primary">
            Details <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
